// const API_HOST = 'http://w.jenniferstudio.cn/english'
const API_HOST = 'https://w.jenniferstudio.cn'
// 登录接口
const API_USER_LOGIN = 'http://w.seayang.me/api/wechat/login'
// 我的班级
const API_CLASS = `${API_HOST}/webservice/student/query_clazz`
// 全部班级
const API_CLASS_LIST = `${API_HOST}/webservice/clazz/query_clazz`
// 班级报名
const API_CLASS_ENROLL = `${API_HOST}/webservice/student/student_enroll`
// 班级通知
const API_NOTICE = `${API_HOST}/webservice/clazz/query_clazz_notice`
const API_NOTICE_DETAIL = `${API_HOST}/webservice/clazz/query_clazz_notice`
// 辅导材料
const API_STUFF = `${API_HOST}/webservice/student/query_stuff`
const API_STUFF_DETAIL = `${API_HOST}/webservice/student/query_stuff_info`
// 班级板书
const API_WRITEON = `${API_HOST}/webservice/student/query_writeon`
const API_WRITEON_DETAIL = `${API_HOST}/webservice/student/query_writeon_info`
// 我的作业
const API_TASK = `${API_HOST}/webservice/student/query_task`
const API_TASK_DETAIL = `${API_HOST}/webservice/student/query_task_info`
const API_TASK_SAVE = `${API_HOST}/webservice/student/save_task`
const API_TASK_SUBMIT = `${API_HOST}/webservice/student/submit_task`
const API_FILE_UPLOAD = `${API_HOST}/webservice/common/upload_audio`
// 个人信息
const API_MEMBER_INFO = `${API_HOST}/webservice/student/self_info`
const API_PASSWORD_UPDATE = `${API_HOST}/webservice/student/update_password`
const API_PHONE_UPDATE = `${API_HOST}/webservice/student/update_phone`

module.exports = {
  API_HOST,
  API_USER_LOGIN,
  API_CLASS,
  API_CLASS_LIST,
  API_CLASS_ENROLL,
  API_NOTICE,
  API_NOTICE_DETAIL,
  API_TASK,
  API_TASK_DETAIL,
  API_TASK_SAVE,
  API_TASK_SUBMIT,
  API_STUFF,
  API_STUFF_DETAIL,
  API_WRITEON,
  API_WRITEON_DETAIL,
  API_FILE_UPLOAD,
  API_MEMBER_INFO,
  API_PASSWORD_UPDATE,
  API_PHONE_UPDATE
}