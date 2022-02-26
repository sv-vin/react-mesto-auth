import React from "react";
import { Link } from "react-router-dom";

const Register = ({ onRegister }) => {
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
    //  if (data.password) {
    //если что сотри это условие!!!!!!
    const { email, password } = data;
    onRegister({ email, password });
  };

  return (
    <main className="enterPage">
      <h1 className="enterPage__text">Регистрация</h1>
      <form onSubmit={handleSubmit} className="enterPage__form">
        <input id="email" name="email" type="email" placeholder="Email" value={data.email} onChange={handleChange} className="enterPage__input" />
        <input id="password" name="password" type="password" placeholder="Пароль" value={data.password} onChange={handleChange} className="enterPage__input" />
        <button type="submit" className="enterPage__button">Зарегистрироваться</button>
      </form>
      <div className="enterPage__signup">
        <p className="enterPage__quest">Уже зарегистрированы?&nbsp;</p>
        <Link to="sign-in" className="enterPage__link">Войти</Link>
      </div>
    </main>
  );
};

export default Register;
