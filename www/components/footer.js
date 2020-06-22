import Link from "next/link";

function Footer() {
  return (
    <footer className="container mx-auto p-4 mt-12">
      <div className="card ~neutral !low">
        <div>
          <h3 className="subheading text-2xl mb-2">Informacije</h3>
          <ul>
            <li>
              <Link href="/info/dostava">Dostava</Link>
            </li>
            <li>
              <Link href="/info/uvjeti-poslovanja">Uvjeti poslovanja</Link>
            </li>
            <li>
              <Link href="/info/o-nama">O nama</Link>
            </li>
            <li>
              <Link href="/info/sigurnost-placanja">Sigurnost plaćanja</Link>
            </li>
            <li>
              <Link href="/info/izjava-o-zastiti-prijenosa-osobnih-podataka">
                Izjava o zaštiti prijenosa osobnih podataka
              </Link>
            </li>
            <li>
              <Link href="/info/kako-kupovati">Kako kupovati</Link>
            </li>
            <li>
              <Link href="/info/povrat-i-zamjena">Povrat i zamjena</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
