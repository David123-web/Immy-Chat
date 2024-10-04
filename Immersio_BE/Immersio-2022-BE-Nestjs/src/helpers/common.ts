import { BadRequestException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from 'kysely/types';
import { PrismaService } from 'src/modules/prisma/prisma.service';

export async function getSubdomainUrl(
    db: Kysely<DB>,
    subdomainId: string
) {
    const subdomain = await db
        .selectFrom('Subdomain')
        .where('id', '=', subdomainId)
        .select('name')
        .executeTakeFirst();

    if (!subdomain) {
        throw new BadRequestException('Subdomain name does not exist!');
    }

    return `https://${subdomain.name}.immersio.io`;
}

export async function getSubdomainInfo(
    prisma: PrismaService,
    subdomainId: string
) {
    const subdomain = await prisma.subdomain.findUnique({
        where: {
            id: subdomainId,
        },
        include: {
            setting: true,
            subdomainTheme: true,
        },
    });

    if (!subdomain) {
        throw new BadRequestException('Subdomain name does not exist!');
    }

    const socialLinks = JSON.parse(subdomain.setting.socialLinks);
    const supportLinks = JSON.parse(subdomain.setting.supportLinks);
    subdomain.setting.socialLinks = socialLinks;
    subdomain.setting.supportLinks = supportLinks;

    return {
        ...subdomain,
        url: `https://${subdomain.name}.immersio.io`,
    };
}

export function generateClassId(intId: number) {
    const paddedId = (intId ? intId + 1 : 1).toString().padStart(8, '0');
    return `CL#${paddedId}`;
}

export const SubdomainHeader = {
    name: 'subdomainid',
    description: 'Subdomain Id',
};

export type JsonDataConvertedStep1 = {
    course_title: string;
    course_description: string;
    course_image_url: string;
    course_language: string;
    course_level: string;
    course_outcome: string;
    course_price: string;
    course_requirement: string;
    course_tag: string;
    course_video_url: string;
    _sections: Array<{
        section_title: string;
        _lessons: Array<{
            lesson_title: string;
        }>;
    }>;
};

export function jsonCourseDataConvertStep1(
    data: Record<string, any>[]
): JsonDataConvertedStep1[] {
    const result: any[] = [];
    let currCourseIndex = -1;
    let currSectionsIndex = 0;

    data.forEach((row) => {
        let sections: any[] = [];

        if (row['course_title'] && row['course_title'].length) {
            currCourseIndex++;
            currSectionsIndex = 0;

            result.push(row);

            if (row['section_title'] && row['section_title'].length) {
                sections.push({
                    section_title: row['section_title'],
                });

                if (row['lesson_title'] && row['lesson_title'].length) {
                    sections[currSectionsIndex]._lessons = [
                        {
                            lesson_title: row['lesson_title'],
                        },
                    ];
                }
            }

            result[currCourseIndex] = {
                ...result[currCourseIndex],
                _sections: sections,
            };
        } else {
            sections = result[currCourseIndex]._sections;

            if (row['section_title'] && row['section_title'].length) {
                currSectionsIndex++;
                sections.push({
                    section_title: row['section_title'],
                });
            }

            const lessons = sections[currSectionsIndex]._lessons || [];
            if (row['lesson_title'] && row['lesson_title'].length) {
                lessons.push({
                    lesson_title: row['lesson_title'],
                });
            }

            sections[currSectionsIndex]._lessons = lessons;

            result[currCourseIndex] = {
                ...result[currCourseIndex],
                _sections: sections,
            };
        }
    });

    return result;
}

export type JsonDataConvertedStep2 = {
    course_section: string;
    _lessons: Array<{
        lesson_title: string;
        lesson_introduction: string;
        lesson_video_url: string;
        _dialogs: Array<{
            dialogue_context: string;
            _lines: Array<{
                character_name: string;
                dialogue_audio_url: string;
                dialogue_text: string;
            }>;
        }>;
    }>;
};
export function jsonCourseDataConvertStep2(
    data: Record<string, any>[]
): JsonDataConvertedStep2[] {
    const result: any[] = [];
    let currSectionIndex = -1;
    let currLessonIndex = 0;
    let currDialogIndex = 0;

    data.forEach((row) => {
        let lessons: any[] = [];

        if (row['course_section'] && row['course_section'].length) {
            currSectionIndex++;
            currLessonIndex = 0;

            result.push(row);

            if (row['lesson_title'] && row['lesson_title'].length) {
                lessons.push({
                    lesson_title: row['lesson_title'],
                    lesson_introduction: row['lesson_introduction'],
                    lesson_video_url: row['lesson_video_url'],
                });

                if (row['dialogue_context'] && row['dialogue_context'].length) {
                    currDialogIndex = 0;
                    lessons[currLessonIndex]._dialogs = [
                        {
                            dialogue_context: row['dialogue_context'],
                        },
                    ];

                    if (row['character_name'] && row['character_name'].length) {
                        lessons[currLessonIndex]._dialogs[
                            currDialogIndex
                        ]._lines = [
                            {
                                character_name: row['character_name'],
                                dialogue_text: row['dialogue_text'],
                                dialogue_audio_url: row['dialogue_audio_url'],
                            },
                        ];
                    }
                }
            }

            result[currSectionIndex] = {
                ...result[currSectionIndex],
                _lessons: lessons,
            };
        } else {
            lessons = result[currSectionIndex]._lessons;

            if (row['lesson_title'] && row['lesson_title'].length) {
                currLessonIndex++;
                lessons.push({
                    lesson_title: row['lesson_title'],
                    lesson_introduction: row['lesson_introduction'],
                    lesson_video_url: row['lesson_video_url'],
                });
            }

            const dialogs = lessons[currLessonIndex]._dialogs || [];
            if (row['dialogue_context'] && row['dialogue_context'].length) {
                dialogs.push({
                    dialogue_context: row['dialogue_context'],
                });
            }

            const lines = dialogs[currDialogIndex]._lines || [];
            if (row['character_name'] && row['character_name'].length) {
                lines.push({
                    character_name: row['character_name'],
                    dialogue_text: row['dialogue_text'],
                    dialogue_audio_url: row['dialogue_audio_url'],
                });
            }

            lessons[currLessonIndex]._dialogs = dialogs;
            lessons[currLessonIndex]._dialogs[currDialogIndex]._lines = lines;

            result[currSectionIndex] = {
                ...result[currSectionIndex],
                _lessons: lessons,
            };
        }
    });

    return result;
}
