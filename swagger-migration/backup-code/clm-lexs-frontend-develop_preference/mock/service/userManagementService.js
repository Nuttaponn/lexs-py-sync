// import { PhoneBook } from '../../src/app/modules/user/user.model';
// import { IContent } from "src/app/modules/user/user.model";

function inquiryUsers() {
  let content = [];
  const phoneBook = {
    category: '',
    email: 'username@gmail.com',
    mobileNumber: '0000000000',
    name: 'นายสมชาย ใจดี',
    nameEng: 'นายสมชาย ใจดี',
    organizationCode: '',
    organizationName: '',
    status: '',
    surname: '',
    surnameEng: '',
    title: '',
    titleEng: '',
    userId: 'username'
  }
  const element = {
    // "userId": "000000001234" + `${index}`, // Column CIF NO
    userId: 'username',
    authorityCode: "",
    dataScopeCode: "",
    groupCode: "",
    lastLogin: new Date(),
    levelCode: "",
    mobileNumber: "",
    organizationCode: "",
    partyCode: "",
    phoneBook: phoneBook,
    roleCode: "AMD Prevention",
    subRoleCode: "Maker",
    teamCode: "",
    disable: true,
  }
  for (let index = 0; index < 10; index++) {
    content.push(element)
  }
  const data = {
    "content": content,
    "empty": true,
    "first": true,
    "last": true,
    "number": 0,
    "numberOfElements": 0,
    "pageable": {
      "offset": 0,
      "pageNumber": 0,
      "pageSize": 0,
      "paged": true,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "unpaged": true
    },
    "size": 0,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "totalElements": 255,
    "totalPages": 8
  }
  return data;
}

module.exports = {
  inquiryUsers: inquiryUsers(),
  getUsers: require('../data/userManagement/getUsers.json'),
  getCurrentUser: require('../data/userManagement/getCurrentUser.json'),
  getUser: require('../data/userManagement/getUserById.json')
};

