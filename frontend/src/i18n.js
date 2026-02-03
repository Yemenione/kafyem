import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            "welcome": "Welcome to Yemeni Heritage",
            "slogan": "Authentic Honey, Coffee & Sidr",
            "products": "Our Products",
            "add_to_cart": "Add to Cart",
            "price": "Price",
            "home": "Home",
            "cart": "Cart",
            "language": "Language",
            "rights_reserved": "All rights reserved.",
            "read_more": "Read More"
        }
    },
    fr: {
        translation: {
            "welcome": "Bienvenue au Héritage Yéménite",
            "slogan": "Miel Authentique, Café & Sidr",
            "products": "Nos Produits",
            "add_to_cart": "Ajouter au Panier",
            "price": "Prix",
            "home": "Accueil",
            "cart": "Panier",
            "language": "Langue",
            "rights_reserved": "Tous droits réservés.",
            "read_more": "Lire la suite"
        }
    },
    ar: {
        translation: {
            "welcome": "مرحباً بكم في التراث اليمني",
            "slogan": "عسل أصلي، قهوة وسدر",
            "products": "منتجاتنا",
            "add_to_cart": "أضف إلى السلة",
            "price": "السعر",
            "home": "الرئيسية",
            "cart": "السلة",
            "language": "اللغة",
            "rights_reserved": "جميع الحقوق محفوظة.",
            "read_more": "اقرأ المزيد"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
