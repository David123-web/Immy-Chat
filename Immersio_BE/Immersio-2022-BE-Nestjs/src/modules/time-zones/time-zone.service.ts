import { Injectable } from '@nestjs/common';
import { timezones } from './../../constants/timezones';

@Injectable()
export class TimeZoneService {
    findAll() {
        return timezones;
    }
}
