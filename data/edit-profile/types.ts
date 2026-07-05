export type PrivacyLevel = "EVERYONE" | "FRIENDS_OF_FRIENDS" | "FRIENDS" | "ONLY_ME";

export type ProfileGeneral = {
  firstName: string;
  lastName: string;
  gender: string;
  relationshipStatus: string;
  birthMonth: string;
  birthDay: string;
  birthDatePrivacy: PrivacyLevel;
  birthYear: string;
  birthYearPrivacy: PrivacyLevel;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  languages: string[];
  languagesPrivacy: PrivacyLevel;
  highSchool: string;
  highSchoolPrivacy: PrivacyLevel;
  college: string;
  collegePrivacy: PrivacyLevel;
  company: string;
  companyPrivacy: PrivacyLevel;
  interestedIn: string[];
  datingPreference: string;
};

export type ProfileSocial = {
  children: string;
  ethnicity: string;
  religion: string;
  politicalView: string;
  sexualOrientation: string;
  sexualOrientationPrivacy: PrivacyLevel;
  humor: string[];
  style: string[];
  smoking: string;
  drinking: string;
  pets: string;
  livingWith: string;
  hometown: string;
  website: string;
  aboutMe: string;
  passions: string;
  sports: string;
  activities: string;
  books: string;
  music: string;
  tvShows: string;
  movies: string;
  cuisines: string;
};

export type ProfileContact = {
  primaryEmail: string;
  primaryEmailPrivacy: PrivacyLevel;
  secondaryEmails: { email: string; privacy: PrivacyLevel }[];
  im1: string;
  im1Privacy: PrivacyLevel;
  im2: string;
  im2Privacy: PrivacyLevel;
  homePhone: string;
  homePhonePrivacy: PrivacyLevel;
  mobilePhone: string;
  mobilePhonePrivacy: PrivacyLevel;
  address1: string;
  address2: string;
  addressCity: string;
  addressState: string;
  addressZipCode: string;
  addressCountry: string;
};

export type ProfileProfessional = {
  education: string;
  school: string;
  college: string;
  course: string;
  degree: string;
  year: string;
  profession: string;
  sector: string;
  company: string;
  jobDescription: string;
  workPhone: string;
  professionalSkills: string;
  professionalInterests: string;
};

export type ProfilePersonal = {
  eyeColor: string;
  hairColor: string;
  height: string;
  bodyType: string;
  appearance: string;
  bodyArt: string;
  perfectMatch: string;
  attractions: string[];
  cantStand: string;
  idealFirstDate: string;
  pastRelationshipsLessons: string;
  whatStandsOut: string;
  favoriteBodyPart: string;
  fiveEssentials: string;
  inMyRoom: string;
};
