require("dotenv").config();
import _, { reject } from "lodash";
import db from "../models/index";
import emailServices from "../services/emailServices";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password", "image"],
        },
        // raw: true
      });
      resolve({
        errCode: 0,
        dâta: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleID: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });

      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let saveDetailInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if ( !inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        await db.Markdown.create({
          contentHTML: inputData.contentHTML,
          contentMarkdown: inputData.contentMarkdown,
          descriptionHTML: inputData.descriptionHTML,
          doctorId: inputData.doctorId,
        });
        resolve({
          errCode: 0,
          errMessage: "Save infor doctor succeed!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailDoctorService = (inpuId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inpuId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: inpuId,
          },
          attributes: {
            exclude: ["password", "image"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            { model: db.Allcode, as: "positionData", attributes: ["valueVi"] },
          ],
          raw: true,
          nest: true,
        });
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let bulkCreateScheduleService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }
        // get all existing data
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formatedDate },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });

        console.log('check existing: ', existing);
        console.log(' check create: ', schedule);

        // compare different
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });

        //create data
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }
        resolve({
          errCode: 0,
          errMessage: "Okay",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getScheduleByDate = (doctorId, date) => {
  return new Promise( async (resolve, reject) => {
      try{
          if( !doctorId || !date){
              resolve({
                  errCode: 1,
                  errMessage: 'Missing required parrameter',
              })
          }
          else{
            let dataSchedule = await db.Schedule.findAll({
                where: {
                    doctorId: doctorId,
                    date: date,
                },

                include:[
                    {model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']},
                    {model: db.User, as: 'doctorData', attributes: ['fistName', 'lastName']},
                  ],
                raw: false,
                nest: true
            })
            if( !dataSchedule) 
                dataSchedule =[];
            resolve({
                errCode: 0,
                data: dataSchedule,
            })
        }
      }catch(e){
          reject(e);
      }
  })
}

let getProfileDoctorById = (inputId) =>{
  return new Promise(async (resolve, reject) => {
      try{
          if(!inputId){
              resolve({
                  errCode: 1,
                  errMessage: 'Missing required parrameter',
              })
          }
          else{
            let data = await db.User.findOne({
              where: {
                id: inputId,
              },
              attributes: {
                exclude: ["password"],
              },
              include: [
                {
                  model: db.Markdown,
                  attributes:['description', 'contentHTML', 'contentMarkdown']
                },
                { model: db.Allcode, as: "positionData", attributes: ["valueVi"] },
                {
                  model: db.Doctor_Infor,
                  attributes:{
                    exclude: ['id', 'doctorId']
                  },
                  include:[
                    {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                    {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},
                    {model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']},
                  ]
                }
              ],
              raw: false,
              nest: true,
            });

            if(data && data.image){
              data.image = new Buffer(data.image, 'base64').toString('binary');
            }
            if(!data) data= {};
            resolve({
              errCode: 0,
              data: data,
            });
          }
      } catch (e) { reject(e);     }
  })
}
let getListPatientForDoctor = (doctorId, date) =>{
  return new Promise(async (resolve, reject) => {
    try{
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parrameter",
        });
      }else{
        let data = await db.Booking.findAll({
          where: {
            statusId: 'S2',
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.User, as: 'patientData',
              attributes: ["email", "firstName", "address", "gender"],
              include:[
                { model: db.Allcode, as: 'genderData', attributes: ['valueVi']}
              ]
            },
            {
              model: db.Allcode, as: 'timetypeDataPatient', attributes: ['valueVi']
            }
          ],
          raw: false,
          nest: true,
        })
        resolve({
          errCode: 0,
          data: data,
        });
      }

    }catch(e){
      reject(e);
    }
  })
}

let sendRemedy = (data) =>{
  return new Promise(async (resolve, reject) => {
    try{
      if (!data.email || !data.doctorId || !data.patientId || !data.timeType || !data.imgBase64) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parrameter",
        });
      }else{
        //Update patient status
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: 'S2',
          },
          raw: false,
        })

        if (appointment) {
          appointment.statusId = 'S3',
          await appointment.save();
        }
        //send email remedy
        await emailServices.sendAttachment1(data);

        resolve({
          errCode: 0,
          errMessage:'OK',
        });
      }

    }catch(e){
      reject(e);
    }
  })
}

let sendRefuse = (data) =>{
  return new Promise(async (resolve, reject) => {
    try{
      if (!data.email || !data.doctorId || !data.patientId || !data.timeType || !data.imgBase64) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parrameter",
        });
      }else{
        //Update patient status
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: 'S2',
          },
          raw: false,
        })

        if (appointment) {
          appointment.statusId = 'S3',
          await appointment.save();
        }
        //send email remedy
        await emailServices.sendAttachment2(data);

        resolve({
          errCode: 0,
          errMessage:'OK',
        });
      }

    }catch(e){
      reject(e);
    }
  })
}

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveDetailInforDoctor: saveDetailInforDoctor,
  getDetailDoctorService: getDetailDoctorService,
  bulkCreateScheduleService: bulkCreateScheduleService,
  getScheduleByDate: getScheduleByDate,
  getProfileDoctorById: getProfileDoctorById,
  getListPatientForDoctor: getListPatientForDoctor,
  sendRemedy: sendRemedy,
  sendRefuse: sendRefuse,
};
