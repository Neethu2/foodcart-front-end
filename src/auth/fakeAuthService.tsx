export interface User {
  id: String;
  name: String;
  email: String;
  password: String;
}

export async function signinApi(email: string, password: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (!email || !password) {
    throw new Error("Invalid email or password");
  }
  return {
    token: "jw-token-1234",
    user: {
      id: "1",
      name: "John Doe",
      email: email,
      password: password,
    },
  } as { token: string; user: User };
}
