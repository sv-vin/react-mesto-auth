import React from "react";

const Login = ({ onLogin }) => {
  const [data, setData] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.email || !data.password) {
      return;
    }
    const { email, password } = data;
    onLogin({ email, password });
  };

  return (
    <main className="enterPage">
      <h1 className="enter-page__text">Вход</h1>
      <form onSubmit={handleSubmit} className="enterPage__form">
        <input type="email" name="email" placeholder="Email" className="enterPage__input" required minLength={2} maxLength={40} id="email" value={data.email} onChange={handleChange} />
        <span className="popup__input-error"></span>
        <input type="password" name="password" placeholder="Пароль" className="enterPage__input" required minLength={2} maxLength={200} id="password" value={data.password} onChange={handleChange} />
        <span className="popup__input-error"></span>
        <button className="enterPage__button" type="submit">Войти</button>
      </form>
    </main>
  );
};

export default Login;
