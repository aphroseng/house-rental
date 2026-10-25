import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const signupTranslations = {
  rw: {
    title: "Kora Konti Nshya",
    nameLabel: "Izina ryose",
    namePlaceholder: "Andika izina ryawe...",
    emailLabel: "Email / Imeri",
    emailPlaceholder: "Andika email yawe...",
    passwordLabel: "Ijambo ry'ibanga",
    passwordPlaceholder: "Kora ijambo ry'ibanga...",
    roleLabel: "Hitamo icyo uri cyo (Role):",
    roleLandlord: "🏢 Nyir'inzu (Landlord)",
    roleTenant: "🏠 Umukodesha (Tenant)",
    signupBtn: "Iwandikishe",
    alreadyHaveAccount: "Ufite konti usanzwe?",
    loginLink: "Injira hano",
    fillAll: "Nyamuneka yuzuza ibyo usabwa byose!",
    userExists: "Iyi email isanzwe ikoreshwa!",
    signupSuccess: "Wiyandikishije neza!"
  },
  en: {
    title: "Create New Account",
    nameLabel: "Full Name",
    namePlaceholder: "Enter your full name...",
    emailLabel: "Email Address",
    emailPlaceholder: "Enter your email...",
    passwordLabel: "Password",
    passwordPlaceholder: "Create a password...",
    roleLabel: "Select Your Role:",
    roleLandlord: "🏢 Landlord",
    roleTenant: "🏠 Tenant",
    signupBtn: "Sign Up",
    alreadyHaveAccount: "Already have an account?",
    loginLink: "Login here",
    fillAll: "Please fill in all required fields!",
    userExists: "This email is already registered!",
    signupSuccess: "Account created successfully!"
  },
  fr: {
    title: "Créer un nouveau compte",
    nameLabel: "Nom complet",
    namePlaceholder: "Entrez votre nom complet...",
    emailLabel: "Adresse E-mail",
    emailPlaceholder: "Entrez votre e-mail...",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Créez un mot de passe...",
    roleLabel: "Choisissez votre rôle:",
    roleLandlord: "🏢 Propriétaire",
    roleTenant: "🏠 Locataire",
    signupBtn: "S'inscrire",
    alreadyHaveAccount: "Vous avez déjà un compte?",
    loginLink: "Connectez-vous ici",
    fillAll: "Veuillez remplir tous les champs!",
    userExists: "Cet e-mail est déjà enregistré!",
    signupSuccess: "Compte créé avec succès!"
  },
  nl: {
    title: "Nieuw account aanmaken",
    nameLabel: "Volledige Naam",
    namePlaceholder: "Voer uw volledige naam in...",
    emailLabel: "E-mailadres",
    emailPlaceholder: "Voer uw e-mail in...",
    passwordLabel: "Wachtwoord",
    passwordPlaceholder: "Maak een wachtwoord aan...",
    roleLabel: "Kies uw rol:",
    roleLandlord: "🏢 Verhuurder",
    roleTenant: "🏠 Huurder",
    signupBtn: "Aanmelden",
    alreadyHaveAccount: "Heeft u al een account?",
    loginLink: "Hier inloggen",
    fillAll: "Vul a.u.b. alle velden in!",
    userExists: "Dit e-mailadres is al geregistreerd!",
    signupSuccess: "Account succesvol aangemaakt!"
  }
};

export default function Signup() {
  const [lang, setLang] = useState('rw');
  const t = signupTranslations[lang];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('landlord');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert(t.fillAll);
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    
    const userExists = registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      alert(t.userExists);
      return;
    }

    const newUser = { name, email, password, role };
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    localStorage.setItem('loggedUser', JSON.stringify(newUser));

    alert(t.signupSuccess);

    if (role === 'landlord') {
      navigate('/landlord');
    } else {
      navigate('/tenant');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#333' }}>📝 {t.title}</h2>
          <select value={lang} onChange={(e) => setLang(e.target.value)} style={styles.langSelect}>
            <option value="rw">🇷🇼 Kinyarwanda</option>
            <option value="en">🇺🇸 English</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="nl">🇳🇱 Nederlands</option>
          </select>
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={styles.label}>{t.nameLabel}</label>
            <input 
              type="text" 
              placeholder={t.namePlaceholder} 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              style={styles.input} 
              required 
            />
          </div>

          <div>
            <label style={styles.label}>{t.emailLabel}</label>
            <input 
              type="email" 
              placeholder={t.emailPlaceholder} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={styles.input} 
              required 
            />
          </div>

          <div>
            <label style={styles.label}>{t.passwordLabel}</label>
            <input 
              type="password" 
              placeholder={t.passwordPlaceholder} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={styles.input} 
              required 
            />
          </div>

          <div>
            <label style={styles.label}>{t.roleLabel}</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
              <option value="landlord">{t.roleLandlord}</option>
              <option value="tenant">{t.roleTenant}</option>
            </select>
          </div>

          <button type="submit" style={styles.submitBtn}>{t.signupBtn}</button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', marginTop: '15px', color: '#666' }}>
          {t.alreadyHaveAccount} <Link to="/login" style={{ color: '#007bff', fontWeight: 'bold' }}>{t.loginLink}</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f4f6f9', fontFamily: 'Arial' },
  card: { background: '#fff', padding: '25px', borderRadius: '8px', width: '380px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  langSelect: { padding: '5px 8px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '12px', background: '#fff', fontWeight: 'bold' },
  label: { fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px', color: '#555' },
  input: { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '13px' },
  submitBtn: { background: '#007bff', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginTop: '5px' }
};