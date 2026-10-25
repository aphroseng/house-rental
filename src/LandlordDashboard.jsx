import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

const landlordTranslations = {
  rw: {
    dashboardTitle: "Dashboard ya Nyir'Inzu",
    receivedNotices: "Integuza",
    viewPayments: "Abishyuye",
    chatTenants: "Chat n'Abakodesha",
    logout: "Sohoka",
    editProperty: "Vugurura Inzu",
    addProperty: "Ongeraho Inzu Nshya",
    propertyTitle: "Izina ry'inzu",
    priceLabel: "Igiciro (Frw)",
    locationLabel: "Aho iherereye",
    imageLinkPlaceholder: "🔗 Andika Link y'Ifoto (Image URL)",
    videoLinkPlaceholder: "🔗 Andika Link ya Video (Video URL - Optional)",
    updateBtn: "Hindura Inzu",
    submitBtn: "Emeza kandi Ubike",
    myProperties: "Amazu Yawe",
    noImg: "Nta Foto",
    editBtn: "Hindura",
    deleteBtn: "Siba",
    deleteConfirm: "Uremeza ko ushaka gusiba iyi nzu?",
    paymentsTitle: "📋 Abishyuye Inzu Zawe",
    noPayments: "Nta muntu urishyura inzu zawe.",
    tenantHeader: "Umukodesha",
    propertyHeader: "Inzu",
    monthsHeader: "Amezi",
    methodHeader: "Uburyo",
    amountHeader: "Amafaranga",
    noticesTitle: "📥 Integuza z'Abakodesha",
    noNotices: "Nta nteguza zihari.",
    reasonLabel: "Impamvu",
    openNotice: "Fungura / Akira",
    chatTitle: "💬 Chat n'Abakodesha",
    selectTenant: "-- Hitamo Umukodesha --",
    typeMsg: "Andika ubutumwa...",
    sendBtn: "Ohereza",
    fillAll: "Nyamuneka yuzuza ibisabwa byose!",
    propUpdated: "Inzu yavuguruwe neza!",
    propAdded: "Inzu yongeweho neza!"
  },
  en: {
    dashboardTitle: "Landlord Dashboard",
    receivedNotices: "Notices",
    viewPayments: "Payments",
    chatTenants: "Chat Tenants",
    logout: "Logout",
    editProperty: "Edit Property",
    addProperty: "Add New Property",
    propertyTitle: "Property Title",
    priceLabel: "Price (Frw)",
    locationLabel: "Location",
    imageLinkPlaceholder: "🔗 Enter Image URL",
    videoLinkPlaceholder: "🔗 Enter Video URL (Optional)",
    updateBtn: "Update Property",
    submitBtn: "Submit and Save",
    myProperties: "My Properties",
    noImg: "No Image",
    editBtn: "Edit",
    deleteBtn: "Delete",
    deleteConfirm: "Are you sure you want to delete this property?",
    paymentsTitle: "📋 Payments Received",
    noPayments: "No payments recorded yet.",
    tenantHeader: "Tenant",
    propertyHeader: "Property",
    monthsHeader: "Months",
    methodHeader: "Method",
    amountHeader: "Amount",
    noticesTitle: "📥 Received Notices",
    noNotices: "No notices available.",
    reasonLabel: "Reason",
    openNotice: "Open / Accept",
    chatTitle: "💬 Chat with Tenants",
    selectTenant: "-- Select Tenant --",
    typeMsg: "Type a message...",
    sendBtn: "Send",
    fillAll: "Please fill in all required fields!",
    propUpdated: "Property updated successfully!",
    propAdded: "Property added successfully!"
  },
  fr: {
    dashboardTitle: "Tableau de Bord Propriétaire",
    receivedNotices: "Avis",
    viewPayments: "Paiements",
    chatTenants: "Discuter avec Locataires",
    logout: "Déconnexion",
    editProperty: "Modifier la Propriété",
    addProperty: "Ajouter une Nouvelle Propriété",
    propertyTitle: "Titre de la propriété",
    priceLabel: "Prix (Frw)",
    locationLabel: "Emplacement",
    imageLinkPlaceholder: "🔗 Entrer l'URL de l'image",
    videoLinkPlaceholder: "🔗 Entrer l'URL de la vidéo (Optionnel)",
    updateBtn: "Mettre à jour",
    submitBtn: "Soumettre et Enregistrer",
    myProperties: "Mes Propriétés",
    noImg: "Pas d'Image",
    editBtn: "Modifier",
    deleteBtn: "Supprimer",
    deleteConfirm: "Êtes-vous sûr de vouloir supprimer cette propriété?",
    paymentsTitle: "📋 Paiements Reçus",
    noPayments: "Aucun paiement enregistré pour le moment.",
    tenantHeader: "Locataire",
    propertyHeader: "Propriété",
    monthsHeader: "Mois",
    methodHeader: "Méthode",
    amountHeader: "Montant",
    noticesTitle: "📥 Avis Reçus",
    noNotices: "Aucun avis disponible.",
    reasonLabel: "Raison",
    openNotice: "Ouvrir / Accepter",
    chatTitle: "💬 Discuter avec les Locataires",
    selectTenant: "-- Sélectionner un Locataire --",
    typeMsg: "Écrivez un message...",
    sendBtn: "Envoyer",
    fillAll: "Veuillez remplir tous les champs obligatoires!",
    propUpdated: "Propriété mise à jour avec succès!",
    propAdded: "Propriété ajoutée avec succès!"
  },
  nl: {
    dashboardTitle: "Verhuurder Dashboard",
    receivedNotices: "Kennisgevingen",
    viewPayments: "Betalingen",
    chatTenants: "Chat met Huurders",
    logout: "Uitloggen",
    editProperty: "Eigendom Bewerken",
    addProperty: "Nieuw Eigendom Toevoegen",
    propertyTitle: "Titel van Pand",
    priceLabel: "Prijs (Frw)",
    locationLabel: "Locatie",
    imageLinkPlaceholder: "🔗 Voer Afbeelding URL in",
    videoLinkPlaceholder: "🔗 Voer Video URL in (Optioneel)",
    updateBtn: "Bijwerken",
    submitBtn: "Verzenden en Opslaan",
    myProperties: "Mijn Panden",
    noImg: "Geen Afbeelding",
    editBtn: "Bewerken",
    deleteBtn: "Verwijderen",
    deleteConfirm: "Weet u zeker dat u dit pand wilt verwijderen?",
    paymentsTitle: "📋 Ontvangen Betalingen",
    noPayments: "Nog geen betalingen geregistreerd.",
    tenantHeader: "Huurder",
    propertyHeader: "Pand",
    monthsHeader: "Maanden",
    methodHeader: "Methode",
    amountHeader: "Bedrag",
    noticesTitle: "📥 Ontvangen Kennisgevingen",
    noNotices: "Geen kennisgevingen beschikbaar.",
    reasonLabel: "Reden",
    openNotice: "Openen / Accepteren",
    chatTitle: "💬 Chat met Huurders",
    selectTenant: "-- Selecteer Huurder --",
    typeMsg: "Typ een bericht...",
    sendBtn: "Verzenden",
    fillAll: "Vul a.u.b. alle verplichte velden in!",
    propUpdated: "Eigendom succesvol bijgewerkt!",
    propAdded: "Eigendom succesvol toegevoegd!"
  }
};

export default function LandlordDashboard() {
  const [lang, setLang] = useState('rw');
  const t = landlordTranslations[lang];

  const [properties, setProperties] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [rentedAlerts, setRentedAlerts] = useState([]);
  const [propertyNotices, setPropertyNotices] = useState([]);
  
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);
  const [showReceivedNoticesModal, setShowReceivedNoticesModal] = useState(false);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [activeTenantEmail, setActiveTenantEmail] = useState(null);
  const [unopenedNoticesCount, setUnopenedNoticesCount] = useState(0);

  const currentUser = JSON.parse(localStorage.getItem('loggedUser')) || JSON.parse(localStorage.getItem('user')) || { name: 'Nyir\'inzu', email: 'landlord@example.com' };

  useEffect(() => {
    const unsubscribeProps = onSnapshot(collection(db, "properties"), (snapshot) => {
      const propsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const myProps = propsList.filter(p => p.landlordEmail === currentUser.email);
      setProperties(myProps);
    });

    const unsubscribeChat = onSnapshot(collection(db, "chatMessages"), (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const myChats = chatList.filter(m => m.landlordEmail === currentUser.email);
      setMessages(myChats);
      const unread = myChats.filter(m => m.role === 'tenant' && !m.read).length;
      setUnreadCount(unread);
    });

    const loadLocalData = () => {
      const savedRented = JSON.parse(localStorage.getItem('rentedProperties')) || [];
      setRentedAlerts(savedRented.filter(r => r.landlordEmail === currentUser.email));

      const savedNotices = JSON.parse(localStorage.getItem('propertyNotices')) || [];
      setPropertyNotices(savedNotices.filter(n => n.landlordEmail === currentUser.email));

      const unopened = savedNotices.filter(n => n.landlordEmail === currentUser.email && n.requestedBy === 'Tenant' && !n.isOpened).length;
      setUnopenedNoticesCount(unopened);
    };

    loadLocalData();
    window.addEventListener('storage', loadLocalData);

    return () => {
      unsubscribeProps();
      unsubscribeChat();
      window.removeEventListener('storage', loadLocalData);
    };
  }, [currentUser.email]);

  const handleOpenNotice = (noticeIndex) => {
    const savedNotices = JSON.parse(localStorage.getItem('propertyNotices')) || [];
    const updated = savedNotices.map((n, idx) => idx === noticeIndex ? { ...n, isOpened: true } : n);
    localStorage.setItem('propertyNotices', JSON.stringify(updated));
    setPropertyNotices(updated.filter(n => n.landlordEmail === currentUser.email));
    setUnopenedNoticesCount(updated.filter(n => n.landlordEmail === currentUser.email && n.requestedBy === 'Tenant' && !n.isOpened).length);
  };

  const handleSaveProperty = async (e) => {
    e.preventDefault();
    if (!title || !price || !location) {
      alert(t.fillAll);
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "properties", editingId), {
          title, 
          price: Number(price), 
          location,
          image: imageUrl,
          video: videoUrl,
          landlordEmail: currentUser.email, 
          landlordName: currentUser.name
        });
        setEditingId(null);
        alert(t.propUpdated);
      } else {
        await addDoc(collection(db, "properties"), {
          title, 
          price: Number(price), 
          location,
          image: imageUrl || '',
          video: videoUrl || '',
          landlordName: currentUser.name,
          landlordEmail: currentUser.email,
          createdAt: new Date()
        });
        alert(t.propAdded);
      }

      setTitle(''); setPrice(''); setLocation(''); setImageUrl(''); setVideoUrl('');
    } catch (error) {
      console.error(error);
      alert("Habaye ikibazo mu kubika inzu.");
    }
  };

  const handleEdit = (prop) => {
    setEditingId(prop.id);
    setTitle(prop.title);
    setPrice(prop.price);
    setLocation(prop.location);
    setImageUrl(prop.image || '');
    setVideoUrl(prop.video || '');
  };

  const handleDelete = async (id) => {
    if (window.confirm(t.deleteConfirm)) {
      await deleteDoc(doc(db, "properties", id));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeTenantEmail) return;

    await addDoc(collection(db, "chatMessages"), {
      sender: currentUser.name, role: 'landlord', text, tenantEmail: activeTenantEmail, landlordEmail: currentUser.email, createdAt: new Date()
    });
    setText('');
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('user');
    window.location.href = '/#/login';
  };

  const uniqueTenants = Array.from(new Set(messages.map(m => m.tenantEmail).filter(Boolean)));
  const activeChatMessages = activeTenantEmail ? messages.filter(m => m.tenantEmail === activeTenantEmail) : [];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>🏢 {currentUser.name} ({t.dashboardTitle})</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          <select value={lang} onChange={(e) => setLang(e.target.value)} style={styles.langSelect}>
            <option value="rw">🇷🇼 Kinyarwanda</option>
            <option value="en">🇺🇸 English</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="nl">🇳🇱 Nederlands</option>
          </select>

          <button onClick={() => setShowReceivedNoticesModal(true)} style={styles.receivedNoticesBtn}>
            📥 {t.receivedNotices} {unopenedNoticesCount > 0 && <span style={styles.badge}>{unopenedNoticesCount}</span>}
          </button>
          <button onClick={() => setShowPaymentsModal(true)} style={styles.paymentsBtn}>📋 {t.viewPayments} ({rentedAlerts.length})</button>
          <button onClick={() => { setShowChat(!showChat); setUnreadCount(0); }} style={styles.chatBtn}>💬 {t.chatTenants} ({unreadCount})</button>
          <button onClick={handleLogout} style={styles.logoutBtn}>{t.logout}</button>
        </div>
      </header>

      {/* MODAL YA INTEGUZA */}
      {showReceivedNoticesModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3>{t.noticesTitle}</h3>
            <button onClick={() => setShowReceivedNoticesModal(false)} style={styles.closeBtn}>✕</button>
            <div style={styles.modalBody}>
              {propertyNotices.length === 0 ? <p>{t.noNotices}</p> : propertyNotices.map((n, idx) => (
                <div key={idx} style={{ background: n.isOpened ? '#fff3cd' : '#e2e3e5', padding: '10px', marginBottom: '8px', borderRadius: '5px' }}>
                  <p>🏠 <b>{n.propertyTitle}</b> - 👤 {n.tenantName}</p>
                  <p>💬 {t.reasonLabel}: {n.reason}</p>
                  {!n.isOpened && <button onClick={() => handleOpenNotice(idx)} style={styles.sendBtn}>{t.openNotice}</button>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL Y'ABISHYUYE */}
      {showPaymentsModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3>{t.paymentsTitle}</h3>
            <button onClick={() => setShowPaymentsModal(false)} style={styles.closeBtn}>✕</button>
            <div style={styles.modalBody}>
              {rentedAlerts.length === 0 ? <p>{t.noPayments}</p> : (
                <table style={styles.table}>
                  <thead><tr><th>{t.tenantHeader}</th><th>{t.propertyHeader}</th><th>{t.monthsHeader}</th><th>{t.methodHeader}</th><th>{t.amountHeader}</th></tr></thead>
                  <tbody>
                    {rentedAlerts.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.tenantName}</td>
                        <td>{item.propertyTitle}</td>
                        <td>{item.months}</td>
                        <td><b>{item.paymentMethod || 'Mobile Money'}</b></td>
                        <td>{item.totalAmount} Frw</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CHAT SECTION */}
      {showChat && (
        <div style={styles.chatSection}>
          <h3>{t.chatTitle}</h3>
          <select value={activeTenantEmail || ''} onChange={(e) => setActiveTenantEmail(e.target.value)} style={styles.input}>
            <option value="">{t.selectTenant}</option>
            {uniqueTenants.map((email, i) => <option key={i} value={email}>{email}</option>)}
          </select>
          {activeTenantEmail && (
            <>
              <div style={styles.chatBox}>
                {activeChatMessages.map((m, i) => (
                  <div key={i} style={{ textAlign: m.role === 'landlord' ? 'right' : 'left', margin: '5px 0' }}>
                    <span style={{ background: m.role === 'landlord' ? '#28a745' : '#fff', color: m.role === 'landlord' ? '#fff' : '#000', padding: '6px 10px', borderRadius: '6px', display: 'inline-block' }}>{m.text}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                <input type="text" placeholder={t.typeMsg} value={text} onChange={(e) => setText(e.target.value)} style={styles.input} />
                <button type="submit" style={styles.sendBtn}>{t.sendBtn}</button>
              </form>
            </>
          )}
        </div>
      )}

      {/* FORM YO KONGERA INZU (URL) */}
      <div style={styles.card}>
        <h3>{editingId ? t.editProperty : t.addProperty}</h3>
        <form onSubmit={handleSaveProperty} style={styles.formGrid}>
          <input type="text" placeholder={t.propertyTitle} value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} required />
          <input type="number" placeholder={t.priceLabel} value={price} onChange={(e) => setPrice(e.target.value)} style={styles.input} required />
          <input type="text" placeholder={t.locationLabel} value={location} onChange={(e) => setLocation(e.target.value)} style={styles.input} required />
          
          <input type="url" placeholder={t.imageLinkPlaceholder} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={styles.input} />
          <input type="url" placeholder={t.videoLinkPlaceholder} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} style={styles.input} />

          <button type="submit" style={{ ...styles.sendBtn, gridColumn: '1 / -1' }}>
            {editingId ? t.updateBtn : t.submitBtn}
          </button>
        </form>
      </div>

      {/* URUTONDE RW'AMAZU */}
      <h3 style={{ marginTop: '20px' }}>{t.myProperties} ({properties.length})</h3>
      <div style={styles.gridContainer}>
        {properties.map(p => (
          <div key={p.id} style={styles.propertyCard}>
            {p.image ? <img src={p.image} alt={p.title} style={styles.img} /> : <div style={styles.noImg}>{t.noImg}</div>}
            {p.video && <video src={p.video} controls style={styles.videoStyle} />}
            <div style={{ padding: '10px' }}>
              <h4>{p.title}</h4>
              <p style={{ color: '#28a745', fontWeight: 'bold' }}>{p.price} Frw</p>
              <p style={{ fontSize: '12px', color: '#666' }}>📍 {p.location}</p>
              <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                <button onClick={() => handleEdit(p)} style={styles.editBtn}>{t.editBtn}</button>
                <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>{t.deleteBtn}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', background: '#f4f6f9', minHeight: '100vh', fontFamily: 'Arial' },
  header: { display: 'flex', justifyContent: 'space-between', background: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '20px', alignItems: 'center' },
  langSelect: { padding: '8px', borderRadius: '5px', border: '1px solid #ccc', background: '#fff', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' },
  card: { background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '10px' },
  input: { width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '12px' },
  sendBtn: { background: '#28a745', color: '#fff', border: 'none', padding: '10px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  logoutBtn: { background: '#dc3545', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' },
  paymentsBtn: { background: '#17a2b8', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' },
  receivedNoticesBtn: { background: '#ffc107', color: '#000', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  chatBtn: { background: '#6610f2', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' },
  gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' },
  propertyCard: { background: '#fff', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' },
  img: { width: '100%', height: '120px', objectFit: 'cover' },
  videoStyle: { width: '100%', height: '100px', objectFit: 'cover', background: '#000' },
  noImg: { width: '100%', height: '120px', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  editBtn: { background: '#ffc107', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer', flex: 1 },
  deleteBtn: { background: '#dc3545', color: '#fff', border: 'none', padding: '5px', borderRadius: '4px', cursor: 'pointer', flex: 1 },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalCard: { background: '#fff', padding: '20px', borderRadius: '8px', width: '500px', position: 'relative' },
  closeBtn: { position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  modalBody: { maxHeight: '300px', overflowY: 'auto', marginTop: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '12px' },
  chatSection: { background: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '20px' },
  chatBox: { height: '150px', background: '#f9f9f9', border: '1px solid #ddd', padding: '10px', overflowY: 'scroll', borderRadius: '5px' },
  badge: { background: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', marginLeft: '4px' }
};