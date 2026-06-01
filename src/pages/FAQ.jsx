import React, { useState } from 'react'
import '../styles/FAQ.css'

function FAQ() {
  const [openQuestion, setOpenQuestion] = useState(null)

  const faqs = [
    {
      id: 1,
      question: 'Jak mogę umówić wizytę w warsztacie?',
      answer: 'Wizytę możesz umówić na trzy sposoby: (1) przez formularz rezerwacji online na naszej stronie, (2) telefonicznie pod numerem 123-456-789, (3) osobiście w warsztacie. Formularz online jest dostępny 24/7 i pozwala wybrać preferowaną datę i godzinę.'
    },
    {
      id: 2,
      question: 'Czy mogę anulować lub zmienić termin wizyty?',
      answer: 'Tak, możesz anulować lub zmienić termin wizyty kontaktując się z nami telefonicznie lub mailowo najpóźniej 24 godziny przed umówionym terminem. W przypadku późniejszego anulowania możemy naliczyć opłatę rezerwacyjną.'
    },
    {
      id: 3,
      question: 'Ile trwa typowy przegląd okresowy?',
      answer: 'Standardowy przegląd okresowy trwa około 1-2 godzin w zależności od stanu pojazdu i zakresu przeglądu. Po wstępnej diagnostyce poinformujemy Cię o dokładnym czasie realizacji.'
    },
    {
      id: 4,
      question: 'Czy używacie oryginalnych części zamiennych?',
      answer: 'Tak, domyślnie używamy oryginalnych części zamiennych lub odpowiedników renomowanych producentów (OEM). Zawsze informujemy klienta o rodzaju części i dajemy możliwość wyboru alternatywnych opcji, jeśli są dostępne.'
    },
    {
      id: 5,
      question: 'Czy udzielacie gwarancji na wykonane naprawy?',
      answer: 'Tak, wszystkie wykonane przez nas naprawy są objęte gwarancją. Gwarancja na robociznę wynosi 12 miesięcy, a na części zgodnie z gwarancją producenta. Szczegóły gwarancji otrzymasz po zakończeniu naprawy.'
    },
    {
      id: 6,
      question: 'Jakie formy płatności są akceptowane?',
      answer: 'Akceptujemy płatności gotówką, kartą płatniczą oraz przelewem bankowym. Dla firm wystawiamy faktury z odroczonym terminem płatności (po wcześniejszym uzgodnieniu).'
    },
    {
      id: 7,
      question: 'Czy mogę obserwować naprawę mojego auta?',
      answer: 'Ze względów bezpieczeństwa i ubezpieczenia nie jest możliwe przebywanie klientów na stanowiskach warsztatowych podczas naprawy. Natomiast zawsze chętnie odpowiemy na pytania i pokażemy wykonane prace po zakończeniu serwisu.'
    },
    {
      id: 8,
      question: 'Czy naprawiacie wszystkie marki samochodów?',
      answer: 'Tak, nasza firma specjalizuje się w naprawie wszystkich marek samochodów osobowych - zarówno europejskich, jak i azjatyckich oraz amerykańskich. Posiadamy odpowiedni sprzęt diagnostyczny i doświadczenie.'
    },
    {
      id: 9,
      question: 'Jak długo trzeba czekać na termin wizyty?',
      answer: 'Czas oczekiwania zależy od rodzaju usługi i aktualnego obłożenia warsztatu. Standardowe przeglądy możemy zazwyczaj zrealizować w ciągu 2-3 dni roboczych, w pilnych przypadkach staramy się przyjąć auto tego samego dnia.'
    },
    {
      id: 10,
      question: 'Czy oferujecie auto zastępcze na czas naprawy?',
      answer: 'Tak, w wybranych przypadkach (przy dłuższych naprawach) możemy udostępnić auto zastępcze. Prosimy o wcześniejsze zgłoszenie takiej potrzeby przy umawianiu wizyty, aby zapewnić dostępność pojazdu.'
    },
    {
      id: 11,
      question: 'Jak mogę śledzić status mojej naprawy?',
      answer: 'Po utworzeniu konta i zalogowaniu się do panelu klienta możesz na bieżąco śledzić status swojej naprawy. System automatycznie aktualizuje informacje o postępie prac. Dodatkowo możesz skontaktować się z nami telefonicznie.'
    },
    {
      id: 12,
      question: 'Czy wykonujecie diagnostykę komputerową?',
      answer: 'Tak, posiadamy profesjonalne urządzenia diagnostyczne kompatybilne z większością marek samochodów. Diagnostyka komputerowa pozwala nam szybko i precyzyjnie zidentyfikować usterkę elektroniki pokładowej.'
    }
  ]

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id)
  }

  return (
    <div className="faq">
      <div className="faq-header">
        <h1>Najczęściej zadawane pytania</h1>
        <p>Znajdź odpowiedzi na najczęstsze pytania dotyczące naszych usług</p>
      </div>

      <div className="faq-container">
        <div className="faq-list">
          {faqs.map(faq => (
            <div
              key={faq.id}
              className={`faq-item ${openQuestion === faq.id ? 'active' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleQuestion(faq.id)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">
                  {openQuestion === faq.id ? '−' : '+'}
                </span>
              </button>

              {openQuestion === faq.id && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faq-contact">
          <h3>Nie znalazłeś odpowiedzi?</h3>
          <p>
            Skontaktuj się z nami bezpośrednio:
          </p>
          <ul>
            <li>📞 Telefon: +48 123 456 789</li>
            <li>📧 Email: kontakt@autoserwis.pl</li>
            <li>🕒 Poniedziałek - Piątek: 8:00 - 18:00, Sobota: 9:00 - 14:00</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FAQ
