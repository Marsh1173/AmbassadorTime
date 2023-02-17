export class LoginValidator {
  public static front_end_validate_username_and_password(
    username: string,
    password: string
  ): string[] {
    let errs: string[] = [];
    if (username === "" && password === "") {
      errs.push("Please enter your username and password.");
    } else if (username === "") {
      errs.push("Please enter your username.");
    } else if (password === "") {
      errs.push("Please enter your password.");
    }
    return errs;
  }
}
