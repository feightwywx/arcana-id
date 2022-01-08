export default function getErrorInfo(code: number | string | undefined) {
  switch (code) {
    case 101: {
      return '用户名已被占用';
    }
    case 104: {
      return '认证失败，可能是用户名或密码错误';
    }
    default: {
      return '未知错误：' + code;
    }
  }
}