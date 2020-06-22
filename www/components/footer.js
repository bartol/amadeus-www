import { useState } from "react";
import Link from "next/link";
import { Send, Mail, Phone, MapPin, Instagram, Facebook, Globe } from "react-feather";

function Footer({ dispatchAlert }) {
  const [email, setEmail] = useState("");

  return (
    <footer className="container mx-auto p-4 mt-12">
      <div className="card ~neutral !low flex justify-around">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-start">
            <h3 className="subheading text-2xl mb-2">Prijavi se na newsletter</h3>
            <input
              type="email"
              placeholder="Vaš email"
              className="input ~neutral !normal mb-3 w-auto"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="button"
              className="button ~info !normal px-3 py-2"
              onClick={() => {
                dispatchAlert("Prijava na newsletter uspješno poslana", "info", Send);
              }}
            >
              <Send />
              <span className="text-lg ml-2">Pošalji</span>
            </button>
          </div>
          <div className="w-56 mt-8">
            <Link href="/">
              <a>
                <img src="/img/logo.png" alt="Amadeus II" />
              </a>
            </Link>
          </div>
        </div>
        <div>
          <h3 className="subheading text-2xl mb-1">Informacije</h3>
          <ul>
            <li>
              <Link href="/info/dostava">
                <a className="portal">Dostava</a>
              </Link>
            </li>
            <li>
              <Link href="/info/uvjeti-poslovanja">
                <a className="portal">Uvjeti poslovanja</a>
              </Link>
            </li>
            <li>
              <Link href="/info/o-nama">
                <a className="portal">O nama</a>
              </Link>
            </li>
            <li>
              <Link href="/info/sigurnost-placanja">
                <a className="portal">Sigurnost plaćanja</a>
              </Link>
            </li>
            <li>
              <Link href="/info/izjava-o-zastiti-prijenosa-osobnih-podataka">
                <a className="portal">Izjava o zaštiti prijenosa osobnih podataka</a>
              </Link>
            </li>
            <li>
              <Link href="/info/kako-kupovati">
                <a className="portal">Kako kupovati</a>
              </Link>
            </li>
            <li>
              <Link href="/info/povrat-i-zamjena">
                <a className="portal">Povrat i zamjena</a>
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="subheading text-2xl mb-1">Kontaktirajte nas</h3>
          <ul>
            <li>
              <a href="mailto:amadeus@pioneer.hr" className="portal">
                <Mail /> <span className="ml-2">amadeus@pioneer.hr</span>
              </a>
            </li>
            <li>
              <a href="tel:+38520670111" className="portal">
                <Phone /> <span className="ml-2">+385 (20) 670 111</span>
              </a>
            </li>
            <li>
              <address>
                <a href="https://goo.gl/maps/74YCcjpq3PBWpKZK9" target="_blank" className="portal">
                  <MapPin /> <span className="ml-2">Vladimira Nazora 45 Ploče</span>
                </a>
              </address>
            </li>
            <li>
              <a href="https://www.instagram.com/amadeusploce/" target="_blank" className="portal">
                <Instagram /> <span className="ml-2">amadeusploce</span>
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/amadeus.ploce" target="_blank" className="portal">
                <Facebook /> <span className="ml-2">Amadeus Ploče</span>
              </a>
            </li>
            <li>
              <a href="https://pioneer.hr" target="_blank" className="portal">
                <Globe /> <span className="ml-2">pioneer.hr</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
