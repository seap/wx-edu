const API_HOST = 'http://w.jenniferstudio.cn'

const API_CLASS = `${API_HOST}/webservice/student/query_clazz`
const API_NOTICE = `${API_HOST}/webservice/clazz/query_clazz_notice`
const API_NOTICE_DETAIL = `${API_HOST}/webservice/clazz/query_clazz_notice`
const API_TASK = `${API_HOST}/webservice/student/query_task`
const API_TASK_DETAIL = `${API_HOST}/webservice/student/query_task_info`
const API_TASK_SAVE = `${API_HOST}/webservice/student/save_task`
const API_TASK_SUBMIT = `${API_HOST}/webservice/student/submit_task`
const API_STUFF = `${API_HOST}/webservice/student/query_stuff`
const API_STUFF_DETAIL = `${API_HOST}/webservice/student/query_stuff_info`
const API_WRITEON = `${API_HOST}/webservice/student/query_writeon`
const API_WRITEON_DETAIL = `${API_HOST}/webservice/student/query_writeon_info`

const API_FILE_UPLOAD = `${API_HOST}/webservice/common/upload_audio`
const API_MEMBER_INFO = `${API_HOST}/webservice/student/self_info`

module.exports = {
  API_HOST,
  API_CLASS,
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
  API_MEMBER_INFO
}