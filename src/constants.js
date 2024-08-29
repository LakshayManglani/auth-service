// ============================================================================
//                                 USER MODEL
// ============================================================================

// User roles

const UserRoleEnum = Object.freeze({
  ADMIN: "ADMIN",
  USER: "USER",
});

const AvailableUserRoles = Object.freeze(Object.values(UserRoleEnum));

// User logins

const UserLoginEnum = Object.freeze({
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
  GOOGLE: "GOOGLE",
});

const AvailableUserLogins = Object.freeze(Object.values(UserLoginEnum));

// User status

const AccountStatusEnum = Object.freeze({
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BANNED: "BANNED",
});

const AvailableAccountStatus = Object.freeze(Object.values(AccountStatusEnum));

// User genders
const UserGenderEnum = Object.freeze({
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
});

const AvailableUserGenders = Object.freeze(Object.values(UserGenderEnum));

export {
  UserRoleEnum,
  AvailableUserRoles,
  UserLoginEnum,
  AvailableUserLogins,
  AccountStatusEnum,
  AvailableAccountStatus,
  UserGenderEnum,
  AvailableUserGenders,
};
