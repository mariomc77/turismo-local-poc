import '../styles/login.css' function Login() { return ( <div className="login-page">
<header className="topbar">
<span>Turismo Local UNA</span>
</header>
<main className="login-content">
<section className="login-card">
<div className="town-icon"> ️ </div>
<h1>Bienvenido a Turismo Local</h1>
<p> Inicia sesión para descubrir los mejores lugares turísticos del pueblo </p>
<a className="google-btn" href="http://localhost:8080/oauth2/authorization/google" > Continuar con Google <span className="google-g">G</span>
</a>
<small> Solo se aceptan cuentas @gmail.com </small>
</section>
</main>
<footer> Universidad Nacional · Programación 4 </footer>
</div> ) } export default Login