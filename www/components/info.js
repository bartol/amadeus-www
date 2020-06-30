import { useState } from "react";
import { Send, AlertCircle } from "react-feather";

function Info({ h1Heading, dispatchAlert }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="flex lg:flex-row flex-col-reverse">
      <div className="relative lg:w-1/2 lg:pb-1/2 pb-full mt-12">
        <iframe
          src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=Amadeus+II+d.o.o.%2c+Ulica+Vladimira+Nazora%2c+Plo%c4%8de&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed"
          className="absolute w-full h-full"
          style={{ filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}
        ></iframe>
      </div>
      <div className="lg:w-1/2 flex justify-center items-center">
        <div className="xl:w-2/3 lg:w-5/6">
          {h1Heading ? (
            <h1 className="heading text-4xl mx-2 mt-12 mb-5">Amadeus II d.o.o. shop</h1>
          ) : (
            <h2 className="heading text-4xl mx-2 mt-12 mb-5">Amadeus II d.o.o. shop</h2>
          )}
          <div className="card ~neutral !low flex flex-col items-start">
            <h3 className="subheading text-2xl mb-2">Kontaktirajte nas</h3>
            <input
              type="email"
              placeholder="Vaš email"
              className="input ~neutral !normal mb-3 w-auto"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              rows="4"
              placeholder="Poruka"
              className="textarea ~neutral !normal mb-3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button
              type="button"
              className="button ~info !normal px-3 py-2"
              onClick={async () => {
                const formData = new URLSearchParams();
                formData.append("email", email);
                formData.append("message", message);

                const data = await fetch("http://localhost:8081/contact/", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: formData.toString(),
                });
                const json = await data.json();
                if (json.status === "success") {
                  dispatchAlert("Poruka uspješno poslana", "info", Send);
                  return;
                }
                dispatchAlert(
                  "Pogreška prilikom slanja poruke. Molimo pokušajte ponovo.",
                  "critical",
                  AlertCircle
                );
              }}
            >
              <Send />
              <span className="text-lg ml-2">Pošalji</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;
