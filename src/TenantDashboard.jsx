import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

const tenantTranslations = {
  rw: {
    welcome: "Muraho", tenantRole: "Umukodesha", myChatsBtn: "Chat Zanjye", logout: "Sohoka",
    searchPlaceholder: "🔍 Shakisha izina ry'inzu cyangwa aho iherereye...", availableProps: "Amazu Aboneka",
    chatWithLandlords: "Chat Zanjye na Ba Nyir'Inzu", typeMsg: "Andika ubutumwa...", sendBtn: "Ohereza",
    payModalTitle: "Kwishyura Inzu", selectMonths: "Hitamo Amezi:", paymentMethodLabel: "Hitamo Uburyo bwo Kwishyura:",
    accountNumberLabel: "Nimero ya Phone cyangwa Konti:", accountPlaceholder: "Urugero: 078... cyangwa Konti y'Ibanki",
    totalLabel: "Yose hamwe", confirmPayment: "Emeza Kwishyura", cancelBtn: "Hagarika",
    noticeModalTitle: "Tanga Integuza", noticeReasonPlaceholder: "Andika impamvu yo kuva mu nzu...",
    submitNotice: "Ohereza Integuza", rentedBadge: "✅ Yarakodeshejwe Nawe",
    noticeDaysBadge: "Isigaje iminsi", marketNotice: "ngo isubire ku isoko",
    rentedPaid: "Yishyuwe", rentPayBtn: "Kodesha / Ishyura", giveNoticeBtn: "📢 Tanga Integuza",
    noImg: "Nta Foto", noticeSuccess: "Integuza yoherejwe neza!",
    paidSuccess: "Wishyuye neza inzu", chatBtn: "Vugana na Nyir'inzu"
  },
  en: {
    welcome: "Hello", tenantRole: "Tenant", myChatsBtn: "My Chats", logout: "Logout",
    searchPlaceholder: "🔍 Search property title or location...", availableProps: "Available Properties",
    chatWithLandlords: "My Chats with Landlords", typeMsg: "Type a message...", sendBtn: "Send",
    payModalTitle: "Pay Property", selectMonths: "Select Months:", paymentMethodLabel: "Select Payment Method:",
    accountNumberLabel: "Phone Number or Account:", accountPlaceholder: "e.g. 078... or Bank Account",
    totalLabel: "Total Amount", confirmPayment: "Confirm Payment", cancelBtn: "Cancel",
    noticeModalTitle: "Give Notice to Vacate", noticeReasonPlaceholder: "Reason for leaving...",
    submitNotice: "Submit Notice", rentedBadge: "✅ Rented By You",
    noticeDaysBadge: "Remaining days:", marketNotice: "to return to market",
    rentedPaid: "Paid", rentPayBtn: "Rent / Pay", giveNoticeBtn: "📢 Give Notice",
    noImg: "No Image", noticeSuccess: "Notice submitted successfully!",
    paidSuccess: "Successfully paid for property", chatBtn: "Chat with Landlord"
  },
  fr: {
    welcome: "Bonjour", tenantRole: "Locataire", myChatsBtn: "Mes Discussions", logout: "Déconnexion",
    searchPlaceholder: "🔍 Rechercher par titre ou emplacement...", availableProps: "Propriétés Disponibles",
    chatWithLandlords: "Mes Discussions avec les Propriétaires", typeMsg: "Écrivez un message...", sendBtn: "Envoyer",
    payModalTitle: "Payer la Propriété", selectMonths: "Sélectionner les Mois:", paymentMethodLabel: "Sélectionner le Mode de Paiement:",
    accountNumberLabel: "Numéro de Téléphone ou Compte:", accountPlaceholder: "ex: 078... ou Compte Banciare",
    totalLabel: "Montant Total", confirmPayment: "Confirmer le Paiement", cancelBtn: "Annuler",
    noticeModalTitle: "Donner un Préavis", noticeReasonPlaceholder: "Raison du départ...",
    submitNotice: "Soumettre le Préavis", rentedBadge: "✅ Loué par Vous",
    noticeDaysBadge: "Jours restants:", marketNotice: "avant remise sur le marché",
    rentedPaid: "Payé", rentPayBtn: "Louer / Payer", giveNoticeBtn: "📢 Donner un Préavis",
    noImg: "Pas d'Image", noticeSuccess: "Préavis envoyé avec succès!",
    paidSuccess: "Paiement réussi pour la propriété", chatBtn: "Discuter avec le Propriétaire"
  },
  nl: {
    welcome: "Hallo", tenantRole: "Huurder", myChatsBtn: "Mijn Chats", logout: "Uitloggen",
    searchPlaceholder: "🔍 Zoek op titel of locatie...", availableProps: "Beschikbare Panden",
    chatWithLandlords: "Mijn Chats met Verhuurders", typeMsg: "Typ een bericht...", sendBtn: "Verzenden",
    payModalTitle: "Betaal Eigendom", selectMonths: "Selecteer Maanden:", paymentMethodLabel: "Selecteer Betaalmethode:",
    accountNumberLabel: "Telefoonnummer of Rekening:", accountPlaceholder: "bijv. 078... of Bankrekening",
    totalLabel: "Totaalbedrag", confirmPayment: "Bevestig Betaling", cancelBtn: "Annuleren",
    noticeModalTitle: "Kennisgeving van Vertrek", noticeReasonPlaceholder: "Reden van vertrek...",
    submitNotice: "Kennisgeving Verzenden", rentedBadge: "✅ Gehuurd door Jou",
    noticeDaysBadge: "Resterende dagen:", marketNotice: "tot terug op de markt",
    rentedPaid: "Betaald", rentPayBtn: "Huren / Betalen", giveNoticeBtn: "📢 Kennisgeving Geven",
    noImg: "Geen Afbeelding", noticeSuccess: "Kennisgeving succesvol verzonden!",
    paidSuccess: "Succesvol betaald voor het pand", chatBtn: "Chat met Verhuurder"
  }
};

export default function TenantDashboard() {
  const [lang, setLang] = useState('rw');
  const t = tenantTranslations[lang];

  const [properties, setProperties] = useState([]);
  const [rentedProps, setRentedProps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [months, setMonths] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('MTN Mobile Money');
  const [accountNumber, setAccountNumber] = useState('');

  const [noticeProperty, setNoticeProperty] = useState(null);
  const [noticeReason, setNoticeReason] = useState('');
  const [noticesList, setNoticesList] = useState([]);

  const [myChats, setMyChats] = useState([]);
  const [showMyChats, setShowMyChats] = useState(false);
  const [chatReplyText, setChatReplyText] = useState('');
  const [activeChatLandlord, setActiveChatLandlord] = useState('');

  const currentTenant = JSON.parse(localStorage.getItem('loggedUser')) || JSON.parse(localStorage.getItem('user')) || { name: 'Umukodesha', email: 'tenant@example.com' };

  useEffect(() => {
    const unsubscribeProps = onSnapshot(collection(db, "properties"), (snapshot) => {
      setProperties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeChat = onSnapshot(collection(db, "chatMessages"), (snapshot) => {
      const allChats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const tenantChats = allChats.filter(m => m.tenantEmail === currentTenant.email);
      setMyChats(tenantChats);
    });

    const loadLocal = () => {
      const savedRented = JSON.parse(localStorage.getItem('rentedProperties')) || [];
      setRentedProps(savedRented);
      const savedNotices = JSON.parse(localStorage.getItem('propertyNotices')) || [];
      setNoticesList(savedNotices);
    };

    loadLocal();
    window.addEventListener('storage', loadLocal);

    return () => {
      unsubscribeProps();
      unsubscribeChat();
    };
  }, [currentTenant.email]);

  const handleLogout = () => {
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('user');
    window.location.href = '/#/login';
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!selectedProperty) return;

    const paymentRecord = {
      propertyId: selectedProperty.id,
      tenantName: currentTenant.name,
      tenantEmail: currentTenant.email,
      propertyTitle: selectedProperty.title,
      landlordEmail: selectedProperty.landlordEmail || '',
      months: Number(months),
      paymentMethod,
      accountNumber,
      totalAmount: selectedProperty.price * Number(months),
      date: new Date().toLocaleDateString()
    };

    const updated = [paymentRecord, ...rentedProps];
    localStorage.setItem('rentedProperties', JSON.stringify(updated));
    setRentedProps(updated);
    alert(`${t.paidSuccess} "${selectedProperty.title}" via ${paymentMethod}!`);
    setSelectedProperty(null);
    setAccountNumber('');
  };

  const handleSendNoticeSubmit = (e) => {
    e.preventDefault();
    if (!noticeProperty || !noticeReason.trim()) return;

    const noticeRecord = {
      propertyId: noticeProperty.id, propertyTitle: noticeProperty.title,
      tenantName: currentTenant.name, tenantEmail: currentTenant.email,
      landlordEmail: noticeProperty.landlordEmail, reason: noticeReason,
      requestedBy: 'Tenant', isOpened: false, date: new Date().toISOString()
    };

    const updatedNotices = [noticeRecord, ...noticesList];
    localStorage.setItem('propertyNotices', JSON.stringify(updatedNotices));
    setNoticesList(updatedNotices);
    alert(t.noticeSuccess);
    setNoticeProperty(null);
    setNoticeReason('');
  };

  const handleSendReplyChat = async (e) => {
    e.preventDefault();
    if (!chatReplyText.trim() || !activeChatLandlord) return;

    await addDoc(collection(db, "chatMessages"), {
      sender: currentTenant.name,
      tenantEmail: currentTenant.email,
      landlordEmail: activeChatLandlord,
      role: 'tenant',
      text: chatReplyText,
      read: false,
      createdAt: new Date()
    });
    setChatReplyText('');
  };

  // IYI FUNCTION ITUMA AKORA KLIKI KURI INZU IKAMUHA EMAIL YA LANDLORD AUTOMATICALLY
  const openChatWithLandlord = (landlordEmail) => {
    if (!landlordEmail) {
      alert("Nta email ya nyir'inzu yabonetse kuri iyi nzu.");
      return;
    }
    setActiveChatLandlord(landlordEmail);
    setShowMyChats(true);
  };

  const filteredProperties = properties.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>🏠 {t.welcome}, {currentTenant.name} ({t.tenantRole})</h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          
          <select value={lang} onChange={(e) => setLang(e.target.value)} style={styles.langSelect}>
            <option value="rw">🇷🇼 Kinyarwanda</option>
            <option value="en">🇺🇸 English</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="nl">🇳🇱 Nederlands</option>
          </select>

          <button onClick={() => setShowMyChats(!showMyChats)} style={styles.chatToggleBtn}>
            💬 {t.myChatsBtn} ({myChats.length})
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>{t.logout}</button>
        </div>
      </header>

      {/* CHAT SECTION KURI TENANT */}
      {showMyChats && (
        <div style={styles.card}>
          <h3>💬 {t.chatWithLandlords}</h3>
          
          {/* KWEREKANA EMAIL YA LANDLORD IRI KUVUGANWAHO */}
          {activeChatLandlord && (
            <p style={{ fontSize: '12px', color: '#007bff', fontWeight: 'bold', margin: '5px 0' }}>
              ✉️ Chat na: {activeChatLandlord}
            </p>
          )}

          <div style={styles.chatHistoryBox}>
            {myChats
              .filter(m => !activeChatLandlord || m.landlordEmail === activeChatLandlord)
              .map((m, i) => (
                <div key={i} style={{ textAlign: m.role === 'tenant' ? 'right' : 'left', margin: '5px 0' }}>
                  <span style={{ background: m.role === 'tenant' ? '#007bff' : '#e2e3e5', color: m.role === 'tenant' ? '#fff' : '#000', padding: '6px 10px', borderRadius: '6px', display: 'inline-block' }}>
                    <small style={{ fontSize: '10px', display: 'block' }}>{m.sender}</small>
                    {m.text}
                  </span>
                </div>
              ))}
          </div>

          <form onSubmit={handleSendReplyChat} style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
            <input 
              type="email" 
              placeholder="Email ya Landlord..." 
              value={activeChatLandlord} 
              onChange={(e) => setActiveChatLandlord(e.target.value)} 
              style={styles.input} 
              required 
            />
            <input 
              type="text" 
              placeholder={t.typeMsg} 
              value={chatReplyText} 
              onChange={(e) => setChatReplyText(e.target.value)} 
              style={styles.input} 
              required 
            />
            <button type="submit" style={styles.sendBtn}>{t.sendBtn}</button>
          </form>
        </div>
      )}

      {/* MODAL YO KWISHYURA */}
      {selectedProperty && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3>💳 {t.payModalTitle}: {selectedProperty.title}</h3>
            <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label>{t.selectMonths}</label>
              <input type="number" min="1" value={months} onChange={(e) => setMonths(e.target.value)} style={styles.input} required />

              <label>{t.paymentMethodLabel}</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={styles.input}>
                <option value="MTN Mobile Money">📲 MTN Mobile Money (*182#)</option>
                <option value="Airtel / Tigo Cash">📱 Airtel / Tigo Cash (*500#)</option>
                <option value="Bank Transfer">🏦 Bank Transfer (BK, Equity, etc.)</option>
              </select>

              <label>{t.accountNumberLabel}</label>
              <input type="text" placeholder={t.accountPlaceholder} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} style={styles.input} required />

              <p style={{ fontWeight: 'bold', color: '#28a745' }}>{t.totalLabel}: {selectedProperty.price * months} Frw</p>

              <button type="submit" style={styles.sendBtn}>{t.confirmPayment}</button>
              <button type="button" onClick={() => setSelectedProperty(null)} style={styles.logoutBtn}>{t.cancelBtn}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL YO GUTANGA INTEGUZA */}
      {noticeProperty && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3>📢 {t.noticeModalTitle}: {noticeProperty.title}</h3>
            <form onSubmit={handleSendNoticeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <textarea placeholder={t.noticeReasonPlaceholder} value={noticeReason} onChange={(e) => setNoticeReason(e.target.value)} style={{ ...styles.input, height: '80px' }} required />
              <button type="submit" style={styles.sendBtn}>{t.submitNotice}</button>
              <button type="button" onClick={() => setNoticeProperty(null)} style={styles.logoutBtn}>{t.cancelBtn}</button>
            </form>
          </div>
        </div>
      )}

      <input type="text" placeholder={t.searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchInput} />

      <h3>{t.availableProps} ({filteredProperties.length})</h3>

      <div style={styles.gridContainer}>
        {filteredProperties.map(p => {
          const isRentedByMe = rentedProps.some(r => r.propertyId === p.id && r.tenantEmail === currentTenant.email);
          const activeNotice = noticesList.find(n => n.propertyId === p.id && n.tenantEmail === currentTenant.email);

          let daysLeft = null;
          if (activeNotice) {
            const noticeDate = new Date(activeNotice.date);
            const expiryDate = new Date(noticeDate.getTime() + 30 * 24 * 60 * 60 * 1000);
            daysLeft = Math.max(0, Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24)));
          }

          return (
            <div key={p.id} style={{ ...styles.propertyCard, borderColor: isRentedByMe ? '#28a745' : '#ddd' }}>
              {p.image ? <img src={p.image} alt={p.title} style={styles.propertyImg} /> : <div style={styles.noImageView}>{t.noImg}</div>}
              {p.video && <video src={p.video} controls style={styles.videoStyle} />}
              <div style={styles.propertyInfo}>
                <h4>{p.title}</h4>
                <p style={styles.price}>{p.price} Frw</p>
                <p style={styles.location}>📍 {p.location}</p>
                <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>👤 Landlord: {p.landlordName || p.landlordEmail}</p>

                {isRentedByMe && <span style={styles.rentedBadge}>{t.rentedBadge}</span>}
                {activeNotice && <span style={styles.noticeBadge}>⏳ {t.noticeDaysBadge} {daysLeft} {t.marketNotice}</span>}

                <button onClick={() => setSelectedProperty(p)} disabled={isRentedByMe} style={{ ...styles.sendBtn, background: isRentedByMe ? '#6c757d' : '#28a745', cursor: isRentedByMe ? 'not-allowed' : 'pointer' }}>
                  💳 {isRentedByMe ? t.rentedPaid : t.rentPayBtn}
                </button>

                {/* BUTONI YO KUVUGANA NA NYIR'INZU IGARURA EMAIL YE AUTOMATICALLY */}
                <button onClick={() => openChatWithLandlord(p.landlordEmail)} style={styles.chatBtn}>
                  💬 {t.chatBtn}
                </button>

                {isRentedByMe && !activeNotice && (
                  <button onClick={() => setNoticeProperty(p)} style={styles.noticeBtn}>
                    {t.giveNoticeBtn}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', background: '#f4f6f9', minHeight: '100vh', fontFamily: 'Arial' },
  header: { display: 'flex', justifyContent: 'space-between', background: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '20px', alignItems: 'center' },
  langSelect: { padding: '8px', borderRadius: '5px', border: '1px solid #ccc', background: '#fff', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' },
  logoutBtn: { background: '#dc3545', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' },
  chatToggleBtn: { background: '#6610f2', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' },
  card: { background: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '20px' },
  chatHistoryBox: { height: '150px', background: '#f9f9f9', border: '1px solid #ddd', padding: '10px', overflowY: 'scroll', borderRadius: '5px' },
  searchInput: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '20px', boxSizing: 'border-box' },
  gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' },
  propertyCard: { background: '#fff', border: '2px solid #ddd', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  propertyImg: { width: '100%', height: '120px', objectFit: 'cover' },
  videoStyle: { width: '100%', height: '100px', objectFit: 'cover', background: '#000' },
  noImageView: { width: '100%', height: '120px', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d' },
  propertyInfo: { padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  price: { color: '#28a745', fontWeight: 'bold', margin: 0 },
  location: { color: '#666', fontSize: '12px', margin: 0 },
  input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  sendBtn: { background: '#28a745', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' },
  chatBtn: { background: '#007bff', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' },
  noticeBtn: { background: '#ffc107', color: '#000', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '11px' },
  rentedBadge: { background: '#d4edda', color: '#155724', padding: '4px', fontSize: '11px', textAlign: 'center', borderRadius: '4px', fontWeight: 'bold' },
  noticeBadge: { background: '#fff3cd', color: '#856404', padding: '4px', fontSize: '10px', textAlign: 'center', borderRadius: '4px', fontWeight: 'bold' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalCard: { background: '#fff', padding: '20px', borderRadius: '8px', width: '350px' }
};