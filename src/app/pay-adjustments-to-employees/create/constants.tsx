const FIELD_NAME_PREFIX = "benefit-deduction-id";
export function mapIndexToFieldName(ind: number): string {
    return `${FIELD_NAME_PREFIX}${ind}`
}

export function stringIsFieldName(s: string): boolean {
    return s.includes(FIELD_NAME_PREFIX);
}

export function mapFieldNameToIndex(name: string): number {
    const indexAsString = name.substring(FIELD_NAME_PREFIX.length)
    return parseInt(indexAsString);
}

//

const FIELD_USER_INPUT_PREFIX = "user-input-";
export function mapIndexToCustomUserInputName(ind: number): string {
    return `${FIELD_USER_INPUT_PREFIX}${ind}`
}

export function stringIsUserInputFieldName(s: string): boolean {
    return s.includes(FIELD_USER_INPUT_PREFIX)
}

export function mapUserInputNameToIndex(name: string): number {
    const indexAsString = name.substring(FIELD_USER_INPUT_PREFIX.length)
    return parseInt(indexAsString);
}

//

export const EMPLOYEE_FIELD_NAME = "employee_id";

export function stringIsEmployeeFieldName(s: string): boolean {
    return s === EMPLOYEE_FIELD_NAME
}

//

const COMMENT_FIELD_NAME_PREFIX = "comment-benefit-deduction-";

export function mapIndexToCommentFieldName(ind: number): string {
    return `${COMMENT_FIELD_NAME_PREFIX}${ind}`;
}

export function stringIsCommentFieldName(s: string): boolean {
    return s.includes(COMMENT_FIELD_NAME_PREFIX)
}

export function mapCommentFieldNameToIndex(name: string): number {
    const indexAsString = name.substring(COMMENT_FIELD_NAME_PREFIX.length)
    return parseInt(indexAsString);
}

///

const START_DATE_FIELD_NAME = "start-date-benefit-deduction-";

export function mapIndexToStartDateFieldName(ind: number): string {
    return `${START_DATE_FIELD_NAME}${ind}`;
}

export function stringIsStartDateField(s: string): boolean {
    return s.includes(START_DATE_FIELD_NAME)
}

export function mapStartDateFieldNameToIndex(name: string): number {
    const indexAsString = name.substring(START_DATE_FIELD_NAME.length)
    return parseInt(indexAsString);
}

///

const END_DATE_FIELD_NAME = "end-date-benefit-deduction-";

export function mapIndexToEndDateFieldName(ind: number): string {
    return `${END_DATE_FIELD_NAME}${ind}`;
}

export function stringIsEndDateField(s: string): boolean {
    return s.includes(END_DATE_FIELD_NAME)
}

export function mapEndDateFieldNameToIndex(name: string): number {
    const indexAsString = name.substring(END_DATE_FIELD_NAME.length)
    return parseInt(indexAsString);
}