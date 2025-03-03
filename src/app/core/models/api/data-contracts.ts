/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CredentialsDTO {
  username?: any;
  password?: any;
}

export interface StandardErrorDTO {
  /**
   * UTC timestamp when the error occurred
   * @format date-time
   * @example "2025-02-03T23:29:48.072Z"
   */
  timestamp?: string;
  /**
   * HTTP status code of the error
   * @format int32
   * @example 400
   */
  status?: number;
  /**
   * Error type or category
   * @example "Unexpected Error"
   */
  error?: string;
  /**
   * Detailed error message
   * @example "An unexpected error occurred. Please try again later or contact the system administrator"
   */
  message?: string;
  /**
   * Request URI where the error occurred
   * @example "/api/resource/123"
   */
  path?: string;
  /**
   * Additional details about the error
   * @example ["Invalid email format"]
   */
  additionalInfo?: string[];
}

export interface UserDTO {
  /** @format uuid */
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  /** @uniqueItems true */
  roles?: UserRole[];
  active?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export enum UserRole {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
}

export interface AddressDTO {
  /** @format uuid */
  id?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  zipCode?: string;
  city?: CityDTO;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface CityDTO {
  /** @format int64 */
  id?: number;
  name?: string;
  state?: StateDTO;
  active?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface SchoolProfileDTO {
  /** @format int64 */
  id?: number;
  name?: string;
  subtitle?: string;
  address?: AddressDTO;
  active?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface StateDTO {
  /** @format int64 */
  id?: number;
  name?: string;
  abbreviation?: string;
  active?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export enum EducationLevel {
  ELEMENTARY = "ELEMENTARY",
  MIDDLE_SCHOOL = "MIDDLE_SCHOOL",
  HIGH_SCHOOL = "HIGH_SCHOOL",
  TECHNICAL = "TECHNICAL",
  INCOMPLETE_HIGHER_EDUCATION = "INCOMPLETE_HIGHER_EDUCATION",
  HIGHER_EDUCATION = "HIGHER_EDUCATION",
  POSTGRADUATE = "POSTGRADUATE",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum MaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
}

export interface PersonDTO {
  /** @format uuid */
  id?: string;
  name?: string;
  /** @format date */
  birthdate?: string;
  email?: string;
  gender?: Gender;
  educationLevel?: EducationLevel;
  maritalStatus?: MaritalStatus;
  address?: AddressDTO;
  phoneNumbers?: PhoneNumberDTO[];
  active?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface PhoneNumberDTO {
  /** @format uuid */
  id?: string;
  areaCode?: string;
  phoneNumber?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface AttendanceDTO {
  /** @format int64 */
  id?: number;
  present?: boolean;
  /** @format uuid */
  studentId?: string;
  lesson?: SimpleLessonDTO;
  /** @uniqueItems true */
  items?: AttendanceItemDTO[];
  /** @uniqueItems true */
  offers?: AttendanceOfferDTO[];
  active?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface AttendanceItemDTO {
  /** @format int64 */
  id?: number;
  /** @format int32 */
  quantity?: number;
  /** @format int64 */
  attendanceId?: number;
  item?: ItemDTO;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface AttendanceOfferDTO {
  /** @format int64 */
  id?: number;
  /** @format int64 */
  attendanceId?: number;
  offer?: OfferDTO;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface ItemDTO {
  /** @format int64 */
  id?: number;
  name?: string;
  icon?: string;
  active?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface LessonDTO {
  /** @format int64 */
  id?: number;
  /** @format int32 */
  lessonNumber?: number;
  /** @format date */
  lessonDate?: string;
  notes?: string;
  /** @format int64 */
  classroomId?: number;
  visitors?: VisitorDTO[];
  /** @uniqueItems true */
  attendances?: AttendanceDTO[];
  /** @uniqueItems true */
  teachings?: TeachingDTO[];
  active?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface OfferDTO {
  /** @format int64 */
  id?: number;
  amount?: number;
  active?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface SimpleLessonDTO {
  /** @format int64 */
  id?: number;
  /** @format int32 */
  lessonNumber?: number;
  /** @format date */
  lessonDate?: string;
  notes?: string;
  /** @format int64 */
  classroomId?: number;
  active?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface TeachingDTO {
  /** @format int64 */
  id?: number;
  /** @format uuid */
  teacherId?: string;
  lesson?: SimpleLessonDTO;
  active?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface VisitorDTO {
  /** @format int64 */
  id?: number;
  name?: string;
  /** @format int64 */
  lessonId?: number;
  /** @uniqueItems true */
  items?: VisitorItemDTO[];
  /** @uniqueItems true */
  offers?: VisitorOfferDTO[];
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface VisitorItemDTO {
  /** @format int64 */
  id?: number;
  /** @format int32 */
  quantity?: number;
  /** @format int64 */
  visitorId?: number;
  /** @format int64 */
  itemId?: number;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface VisitorOfferDTO {
  /** @format int64 */
  id?: number;
  /** @format int64 */
  visitorId?: number;
  offer?: OfferDTO;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface AgeRangeDTO {
  /** @format int64 */
  id?: number;
  name?: string;
  /** @format int32 */
  minAge?: number;
  /** @format int32 */
  maxAge?: number;
  active?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface ClassroomDTO {
  /** @format int64 */
  id?: number;
  name?: string;
  ageRange?: AgeRangeDTO;
  /** @uniqueItems true */
  teachers?: TeacherDTO[];
  /** @uniqueItems true */
  students?: StudentDTO[];
  active?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface StudentDTO {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  personId?: string;
  personName?: string;
  active?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface TeacherDTO {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  personId?: string;
  personName?: string;
  active?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface TokenResponseDTO {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  /** @format int64 */
  expires_in?: number;
  /** @format int64 */
  created_at?: number;
}

export interface ClassroomAttendanceDTO {
  classroom?: SimpleClassroomDTO;
  attendances?: AttendanceDTO[];
  /** @format int32 */
  totalLessons?: number;
  /** @format int32 */
  attendedLessons?: number;
  /** @format int32 */
  missedLessons?: number;
}

export interface PersonReportDTO {
  person?: PersonDTO;
  attendancesByClassroom?: ClassroomAttendanceDTO[];
  /** @format int32 */
  totalLessons?: number;
  /** @format int32 */
  attendedLessons?: number;
  /** @format int32 */
  missedLessons?: number;
}

export interface SimpleClassroomDTO {
  /** @format int64 */
  id?: number;
  name?: string;
  ageRange?: AgeRangeDTO;
  active?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}

export interface CitySimpleDTO {
  /** @format int64 */
  id?: number;
  name?: string;
  active?: boolean;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
}
