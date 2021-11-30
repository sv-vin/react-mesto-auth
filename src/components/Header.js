import logo from '../images/logo.svg';

function Header() {
    return (
        <>
            <header className="header">
                <img src={logo} className="header__logo" alt="Логотип места России" />
            </header>
        </>
    );
}

export default Header;