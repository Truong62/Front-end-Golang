import {useMutation} from '@tanstack/react-query';

type LoginProps = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  token?: string;
  message?: string;
};

const loginRequest = async (body: LoginProps): Promise<LoginResponse> => {
  const res = await fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'lỗi rồi cu');
  return data;
};

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginProps>({
    mutationFn: loginRequest,
  });
}
