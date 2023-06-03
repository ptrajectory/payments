export const format_mpesa_date = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    let string_month = month.toString();
    if (string_month.length === 1) {
      string_month = `0${string_month}`;
    }
    const day = date.getDate();
    let string_day = day.toString();
    if (string_day.length === 1) {
      string_day = `0${string_day}`;
    }
    const hours = date.getHours();
    let string_hours = hours.toString();
    if (string_hours.length === 1) {
      string_hours = `0${string_hours}`;
    }
    const minutes = date.getMinutes();
    let string_minutes = minutes.toString();
    if (string_minutes.length === 1) {
      string_minutes = `0${string_minutes}`;
    }
    const seconds = date.getSeconds();
    let string_seconds = seconds.toString();
    if (string_seconds.length === 1) {
      string_seconds = `0${string_seconds}`;
    }
    return `${year}${string_month}${string_day}${string_hours}${string_minutes}${string_seconds}`;
  }


  export function _generate_password(): {
    password: string;
    timestamp: string;
  }{
    const mpesa_shortcode = process.env.BUSINESS_SHORTCODE;
    const mpesa_passkey = process.env.PASS_KEY;
    const timestamp = format_mpesa_date(new Date());
    const pre = `${mpesa_shortcode}${mpesa_passkey}${timestamp}`
    const password = Buffer.from(pre).toString("base64");
    return {
      password,
      timestamp,
    }
  }