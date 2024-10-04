import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { UsersService } from 'src/modules/users/users.service'; 
import { CoursesService } from 'src/modules/courses/courses.service';
import { InvoiceService } from 'src/modules/invoices/invoice.service';
import { ClassBookingService } from 'src/modules/class-booking/class-booking.service';
import { SubscriptionPlansService } from 'src/modules/subscription-plans/subscription-plans.service';
import { SubscriptionsService } from 'src/modules/subscription/subscriptions.service';


import { PurchaseWithCreditDTO } from './dto/purchase-with-credit.dto';
import { ProductPurchaseDTO } from './dto/product-purchase.dto';
import { CreateSubscriptionDto } from 'src/modules/subscription/dto/create-subscription.dto';
import { UpdateUserCreditsDto } from 'src/modules/users/dto/update-user-credits-dto';

import { ProductTypes } from 'src/constants/business-constants'; 
import { SubscriptionStatus } from '@prisma/client';
import { PaymentMethod } from '@prisma/client';
import { CreateCourseStudentDto } from 'src/modules/course-student/dto/create-coursestudent.dto';
import { CourseStudentService } from 'src/modules/course-student/course-student.service';

@Injectable()
export class UserAccountService {
    SUCCESS = 'SUCCESS';
    DB_FAILED = 'DB_FAILED';
    NO_DIRECT_PURCHASE = 'NO_DIRECT_PURCHASE';
    INSUFFICIENT_CREDIT = 'INSUFFICIENT_CREDIT';
    CRITICAL_ERROR = 'CRITICAL_ERROR';
    UNEXPECTED_ERROR = '500_UNEXPECTED';
    ACTIVE_SUBSCRIPTION_EXISTS = 'ACTIVE_SUBSCRIPTION_EXISTS';
    NO_SUBSCRIPTION_EXISTS = 'NO_SUBSCRIPTION_EXISTS';
    COURSE_ALREADY_PAID = 'COURSE_ALREADY_PAID';
    BUY_CREDIT_WITH_CREDIT = 'BUY_CREDIT_WITH_CREDIT????';
    NO_SUBSCRIPTION_PLAN_EXISTS = 'NO_SUBSCRIPTION_EXISTS';

    constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly coursesService: CoursesService,
    private readonly invoiceService: InvoiceService,
    private readonly subscriptionPlansService: SubscriptionPlansService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly courseStudentService: CourseStudentService
    ) {}

    async purchaseWithCredit(purchase: PurchaseWithCreditDTO) {
        const purchaseResults:Array<ProductPurchaseDTO> = [];
        try{
            for (const product of purchase.products) {
                const productReturned = await this._triageProductPurchase(
                    purchase,
                    product
                );
                purchaseResults.push(productReturned);
            }
            return purchaseResults;
        }catch(error){
            return await this._handleError(purchaseResults, error);
        }
    }

    async _handleError(purchaseResults: Array<ProductPurchaseDTO>, error: Error){
        if(purchaseResults.length == 0){
            const productPurchaseDto = {
                productId: '',
                unitCount: -1,
                productType: '',
                creditProcessingComplete: false,
                creditProcessingMessage: `${this.UNEXPECTED_ERROR}_${error.message}`,
                creditsSpent: 0,
            };
            return [productPurchaseDto];
        }
        for( const product of purchaseResults){
            if(!product.creditProcessingComplete){
                product.creditProcessingMessage = product.creditProcessingMessage + error.message;
            }
        }
        return purchaseResults;
    }

    async _triageProductPurchase(purchase: PurchaseWithCreditDTO, product) {
        if (product.productType === ProductTypes.CLASS) {
            return await this._processClassPurchase(purchase, product);
        } else if (product.productType === ProductTypes.SUBSCRIPTION) {
            return await this._processSubscriptionPurchase(purchase, product);
        } else if (product.productType === ProductTypes.CREDIT) {
            return await this._processCreditPurchase(purchase, product);
        } else if (product.productType === ProductTypes.COURSE) {
            return await this._processCoursePurchase(purchase, product);
        }
    }

    

    async _processSubscriptionPurchase(purchase:PurchaseWithCreditDTO, product: ProductPurchaseDTO) {
        const plan = await this.subscriptionPlansService.findOne(product.productId);
        const userDto:UpdateUserCreditsDto = await this._getUser(purchase);
        if(await this._hasActiveSubscription(userDto.userId, product.productId)){
            product.creditProcessingMessage = this.ACTIVE_SUBSCRIPTION_EXISTS;
        } else {
            if(plan && plan.id){
                if(purchase.paymentMethod === PaymentMethod.IMMERSIO_CREDIT){
                    product = await this._purchaseSubscriptionFromCredit(plan, userDto,purchase,product);
                } else {
                    product = await this._purchaseSubscriptionFromPayment(plan, userDto,purchase,product);
                }
            } else {

                product.creditProcessingMessage = this.NO_SUBSCRIPTION_PLAN_EXISTS;
            }
        }
        return product;
    }

    async _purchaseSubscriptionFromCredit(plan, userDto:UpdateUserCreditsDto, purchase:PurchaseWithCreditDTO, product:ProductPurchaseDTO){
        product =  await this._payFromAvailableCredits(userDto, purchase, product);
        if(product.creditProcessingMessage === this.SUCCESS){
            product = await this._createSubscriptionForUser(plan, userDto, purchase, product);
        }
        return product;
    }

    async _purchaseSubscriptionFromPayment(plan, userDto:UpdateUserCreditsDto, purchase:PurchaseWithCreditDTO, product:ProductPurchaseDTO){
        product =  await this._paidDirectFromPayment(userDto, purchase, product);
        if(product.creditProcessingMessage === this.SUCCESS){
            
            product = await this._createSubscriptionForUser(plan, userDto, purchase, product);
        } 
        return product;
    }

    async _purchaseCourseFromCredit(userDto:UpdateUserCreditsDto, purchase:PurchaseWithCreditDTO, product:ProductPurchaseDTO){
        product =  await this._payFromAvailableCredits(userDto, purchase, product);
        if(product.creditProcessingMessage === this.SUCCESS){
            
            product = await this._enableCourseForUser(userDto, purchase, product);
        }
        return product;
    }

    async _purchaseCourseFromPayment(userDto:UpdateUserCreditsDto, purchase:PurchaseWithCreditDTO, product:ProductPurchaseDTO){
        product =  await this._paidDirectFromPayment(userDto, purchase, product);
        if(product.creditProcessingMessage === this.SUCCESS){
            
            product = await this._enableCourseForUser(userDto, purchase, product);
        } 
        return product;
    }

    async _enableCourseForUser(userDto:UpdateUserCreditsDto, purchase:PurchaseWithCreditDTO, product:ProductPurchaseDTO){
        
        const createCourseStudentDto: CreateCourseStudentDto =     {

            courseId: parseInt(product.productId), 
            studentId: 0,
            userId: purchase.userId,
            active: true,
            subdomainId: purchase.subdomainId,
            purchased: true,
        };
        
        const result = await this.courseStudentService.assignStudentToCourse(createCourseStudentDto);
        /// this identifies the data base row unlocked with this purchase
        product.purchaseId = `${result.courseId}_${result.userId}`;
        return product;
    }

    async _createSubscriptionForUser(plan, userDto:UpdateUserCreditsDto, purchase:PurchaseWithCreditDTO, product:ProductPurchaseDTO){
        const subscriptionDto: CreateSubscriptionDto = {
            userId: userDto.userId,
            planId: plan.id,
            subdomainId: purchase.subdomainId,
            referenceId: `${product.productType}_${product.productId}_${Date.now()}`,
            status: SubscriptionStatus.ACTIVATED,
            method: purchase.paymentMethod,
            trialEndAt: new Date(),
            endAt: this._calculateEndDate(plan.term),
            nextBillingTime: this._calculateEndDate(plan.term)
        };
        const result = await this.subscriptionsService.create(purchase.subdomainId, subscriptionDto);
        if(!result || !result.id){
            product.creditProcessingComplete = false;
            product.creditProcessingMessage = this.DB_FAILED;
            
        } else {
            product.creditProcessingComplete = true;
            product.creditProcessingMessage = this.SUCCESS;
            /// this identifies the data base row unlocked with this purchase
            product.purchaseId = result.id;
        }
        return product;
    }

    async _processCreditPurchase(purchase: PurchaseWithCreditDTO, product: ProductPurchaseDTO) {
        const userDto:UpdateUserCreditsDto = await this._getUser(purchase);
        if(purchase.paymentMethod !== PaymentMethod.IMMERSIO_CREDIT){
            product = await this._purchaseCredits(userDto, purchase, product);
            await this._generateInvoice(purchase, product);
        } else {
            product.creditProcessingMessage = this.BUY_CREDIT_WITH_CREDIT;
        }
        return product;
    }

    async _processCoursePurchase(purchase: PurchaseWithCreditDTO, product: ProductPurchaseDTO) {
        const hasSubscription: boolean = await this._hasAnyActiveSubscription(purchase.userId);
        const alreadyPaid: boolean =  await this.courseStudentService.hasPaid(purchase.userId, parseInt(product.productId));
        if(!hasSubscription){
            product.creditProcessingMessage = this.NO_SUBSCRIPTION_EXISTS;

        } else if(alreadyPaid ){
            product.creditProcessingMessage = this.COURSE_ALREADY_PAID;
        }
        else {
            const userDto = await this._getUser(purchase);
            if(purchase.paymentMethod === PaymentMethod.IMMERSIO_CREDIT){
                this._purchaseCourseFromCredit(userDto, purchase, product);
            } else{
                this._purchaseCourseFromPayment(userDto, purchase, product);
            }
        }
        this._generateInvoice(purchase, product);
        return product;
    }

    async _processClassPurchase(
        purchase: PurchaseWithCreditDTO,
        product: ProductPurchaseDTO
    ) {
        
        const userDto = await this._getUser(purchase);
        
        if (purchase.paymentMethod === PaymentMethod.IMMERSIO_CREDIT) {
            await this._bookFromAvailableCredits(userDto, purchase, product);
            
        } else {
            product.creditProcessingComplete = false;
            product.creditProcessingMessage = `${this.NO_DIRECT_PURCHASE} Classes can only be purchased with credit`;
        }

        
        return product;
    }

    async _generateInvoice(purchase: PurchaseWithCreditDTO, product: ProductPurchaseDTO) {
        console.log('generating invoice');
    }


    async _bookFromAvailableCredits(user:UpdateUserCreditsDto, purchase: PurchaseWithCreditDTO, product:ProductPurchaseDTO ){
        if (
            this._isCreditAvailable(user.availableCredits, product.creditsSpent)
        ) {
            const newAvailableCredits = user.availableCredits - product.creditsSpent;
            const newBookedCredits = user.bookedCredits + product.creditsSpent;

            const updateUserCreditsDto = {
                availableCredits: newAvailableCredits,
                bookedCredits: newBookedCredits,
                usedCredits: user.usedCredits,
                userId: user.userId
            };
            const result = await this.usersService.updateUserCredits(
                user.userId,
                updateUserCreditsDto
            );
            if (
                result.availableCredits == newAvailableCredits && result.bookedCredits == newBookedCredits
            ) {
                product.creditProcessingComplete = true;
                product.creditProcessingMessage = this.SUCCESS;
                this._generateInvoice(purchase, product);
            } else {
                product.creditProcessingComplete = false;
                product.creditProcessingMessage = this.DB_FAILED;
            }
        } else {
            product.creditProcessingComplete = false;
            product.creditProcessingMessage = this.INSUFFICIENT_CREDIT;

        }
        return product;
    }


    /** UNTESTED METHOD */
    async _rollbackCreditTransaction(user:UpdateUserCreditsDto, purchase: PurchaseWithCreditDTO, product:ProductPurchaseDTO ){

        const newAvailableCredits = user.availableCredits + product.creditsSpent;
        const newUsedCredits = user.usedCredits - product.creditsSpent;

        const updateUserCreditsDto = {
            availableCredits: newAvailableCredits,
            bookedCredits: user.bookedCredits,
            usedCredits: newUsedCredits,
            userId: user.userId
        };
        const result = await this.usersService.updateUserCredits(
            user.userId,
            updateUserCreditsDto
        );
        if (
            result.availableCredits != newAvailableCredits || result.usedCredits != newUsedCredits
        ) {
            product.creditProcessingComplete = true;
            product.creditProcessingMessage = this.CRITICAL_ERROR;
        } 
        return product;
    }

    async _purchaseCredits(user:UpdateUserCreditsDto, purchase: PurchaseWithCreditDTO, product:ProductPurchaseDTO ){
        const newAvailableCredits = user.availableCredits + product.creditsSpent;
        const updateUserCreditsDto = {
            availableCredits: newAvailableCredits,
            bookedCredits: user.bookedCredits,
            usedCredits: user.usedCredits,
            userId: user.userId
        };
        const result = await this.usersService.updateUserCredits(
            user.userId,
            updateUserCreditsDto
        );
        if (
            result.availableCredits == newAvailableCredits
        ) {
            product.creditProcessingComplete = true;
            product.creditProcessingMessage = this.SUCCESS;
            /// this identifies the data base row unlocked with this purchase
            product.purchaseId = user.userId;
            this._generateInvoice(purchase, product);
        } else {
            product.creditProcessingComplete = false;
            product.creditProcessingMessage = this.DB_FAILED;
        }

        return product;
    }

    async _payFromAvailableCredits(user:UpdateUserCreditsDto, purchase: PurchaseWithCreditDTO, product:ProductPurchaseDTO ){
        if (
            this._isCreditAvailable(user.availableCredits, product.creditsSpent)
        ) {
            const newAvailableCredits = user.availableCredits - product.creditsSpent;
            const newUsedCredits = user.usedCredits + product.creditsSpent;

            const updateUserCreditsDto = {
                availableCredits: newAvailableCredits,
                bookedCredits: user.bookedCredits,
                usedCredits: newUsedCredits,
                userId: user.userId
            };
            const result = await this.usersService.updateUserCredits(
                user.userId,
                updateUserCreditsDto
            );
            if (
                result.availableCredits == newAvailableCredits && result.usedCredits == newUsedCredits
            ) {
                product.creditProcessingComplete = true;
                product.creditProcessingMessage = this.SUCCESS;
                this._generateInvoice(purchase, product);
            } else {
                product.creditProcessingComplete = false;
                product.creditProcessingMessage = this.DB_FAILED;
            }
        } else {
            product.creditProcessingComplete = false;
            product.creditProcessingMessage = this.INSUFFICIENT_CREDIT;

        }
        return product;
    }


    async _paidDirectFromPayment(user:UpdateUserCreditsDto, purchase: PurchaseWithCreditDTO, product:ProductPurchaseDTO ){

        const newUsedCredits = user.usedCredits + product.creditsSpent;

        const updateUserCreditsDto = {
            availableCredits: user.availableCredits,
            bookedCredits: user.bookedCredits,
            usedCredits: newUsedCredits,
            userId: user.userId
        };
        const result = await this.usersService.updateUserCredits(
            user.userId,
            updateUserCreditsDto
        );
        if (
            result.usedCredits == newUsedCredits
        ) {
            product.creditProcessingComplete = true;
            product.creditProcessingMessage = this.SUCCESS;
            this._generateInvoice(purchase, product);
        } else {
            product.creditProcessingComplete = false;
            product.creditProcessingMessage = this.DB_FAILED;
        }

        return product;
    }

    async _hasActiveSubscription(userId: string, planId: string){
        const plans = await this.subscriptionsService.findExtantPlanForUser(userId, planId);
        if(!plans){
            return false;
        } else {
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            for (const plan of plans){
                if(plan.endAt > threeDaysAgo){
                    return true;
                }
            }
        }
        return false;
    }

    async _hasAnyActiveSubscription(userId: string){
        const plans = await this.subscriptionsService.findAnyExtantPlanForUser(userId);
        if(!plans){
            return false;
        } else {
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            for (const plan of plans){
                if(plan.endAt > threeDaysAgo){
                    return true;
                }
            }
        }
        return false;
    }

    _isCreditAvailable(availableCredits: number, creditsSpent: number) {
        const creditAvailable: boolean = availableCredits >= creditsSpent;
        return creditAvailable;
    }

    _calculateEndDate(term: number){
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + term);
        return currentDate;
    }

    async _getUser(purchase: PurchaseWithCreditDTO ){
        const user = await this.usersService.findById(purchase.userId);
        const userDto = new UpdateUserCreditsDto();
        userDto.availableCredits = user.availableCredits; // Replace with the actual method or property
        userDto.bookedCredits = user.bookedCredits; // Replace with the actual method or property
        userDto.usedCredits = user.usedCredits;
        userDto.userId = user.id;
        return userDto;
    }
}