import React, { useState } from 'react'
import '../styles/Services.css'

function Services() {
  
  const [selectedCategory, setSelectedCategory] = useState('all')

  const services = [
    
    {
      id: 1,
      category: 'mechanika',
      name: 'Wymiana oleju i filtrów',
      price: '150-250 zł',
      description: 'Wymiana oleju silnikowego wraz z filtrem oleju i powietrza'
    },
    {
      id: 2,
      category: 'mechanika',
      name: 'Wymiana klocków hamulcowych',
      price: '200-400 zł',
      description: 'Wymiana klocków hamulcowych przednich lub tylnych'
    },
    {
      id: 3,
      category: 'mechanika',
      name: 'Wymiana rozrządu',
      price: '800-1500 zł',
      description: 'Wymiana paska/łańcucha rozrządu wraz z rolkami'
    },
    {
      id: 4,
      category: 'mechanika',
      name: 'Wymiana tarcz hamulcowych',
      price: '300-600 zł',
      description: 'Wymiana tarcz hamulcowych przednich lub tylnych wraz z klockami'
    },
    {
      id: 5,
      category: 'mechanika',
      name: 'Wymiana świec zapłonowych',
      price: '100-300 zł',
      description: 'Wymiana świec zapłonowych wraz z kontrolą układu zapłonowego'
    },
    {
      id: 6,
      category: 'mechanika',
      name: 'Naprawa zawieszenia',
      price: '300-1200 zł',
      description: 'Wymiana wahaczów, tulei, amortyzatorów i innych elementów zawieszenia'
    },
    {
      id: 7,
      category: 'mechanika',
      name: 'Wymiana sprzęgła',
      price: '800-1800 zł',
      description: 'Wymiana kompletu sprzęgła (tarcza, docisk, łożysko)'
    },

    {
      id: 8,
      category: 'diagnostyka',
      name: 'Diagnostyka komputerowa',
      price: '100-200 zł',
      description: 'Kompleksowa diagnostyka układów elektronicznych pojazdu'
    },
    {
      id: 9,
      category: 'diagnostyka',
      name: 'Przegląd techniczny',
      price: '150 zł',
      description: 'Kontrola stanu technicznego pojazdu przed badaniem technicznym'
    },
    {
      id: 10,
      category: 'diagnostyka',
      name: 'Przegląd okresowy',
      price: '200-350 zł',
      description: 'Kompleksowy przegląd pojazdu zgodny z zaleceniami producenta'
    },
    {
      id: 11,
      category: 'diagnostyka',
      name: 'Diagnostyka zawieszenia',
      price: '150-250 zł',
      description: 'Sprawdzenie stanu technicznego elementów zawieszenia'
    },

    {
      id: 12,
      category: 'elektryk',
      name: 'Naprawa instalacji elektrycznej',
      price: '200-600 zł',
      description: 'Diagnoza i naprawa usterek w instalacji elektrycznej'
    },
    {
      id: 13,
      category: 'elektryk',
      name: 'Wymiana akumulatora',
      price: '300-800 zł',
      description: 'Wymiana akumulatora wraz z diagnostyką układu ładowania'
    },
    {
      id: 14,
      category: 'elektryk',
      name: 'Naprawa alternator/rozrusznik',
      price: '400-900 zł',
      description: 'Wymiana lub naprawa alternatora/rozrusznika'
    },
    {
      id: 15,
      category: 'elektryk',
      name: 'Programowanie kluczy',
      price: '200-500 zł',
      description: 'Kodowanie i programowanie nowych kluczy oraz pilotów'
    },
    {
      id: 16,
      category: 'elektryk',
      name: 'Wymiana reflektorów',
      price: '150-400 zł',
      description: 'Wymiana lamp, żarówek i regulacja świateł'
    },

    {
      id: 17,
      category: 'klimatyzacja',
      name: 'Serwis klimatyzacji',
      price: '200-350 zł',
      description: 'Odgrzybianie, dezynfekcja i uzupełnienie czynnika'
    },
    {
      id: 18,
      category: 'klimatyzacja',
      name: 'Naprawa klimatyzacji',
      price: '400-1200 zł',
      description: 'Diagnoza i naprawa układu klimatyzacji (sprężarka, skraplacz, parownik)'
    },
    {
      id: 19,
      category: 'klimatyzacja',
      name: 'Ozonowanie wnętrza',
      price: '100-150 zł',
      description: 'Dezynfekcja i usunięcie nieprzyjemnych zapachów z wnętrza pojazdu'
    },

    {
      id: 20,
      category: 'blacharstwo',
      name: 'Naprawa karoserii',
      price: '500-3000 zł',
      description: 'Usuwanie wgnieceń, naprawa blacharska elementów karoserii'
    },
    {
      id: 21,
      category: 'blacharstwo',
      name: 'Lakierowanie elementów',
      price: '400-2000 zł',
      description: 'Lakierowanie pojedynczych elementów karoserii'
    },
    {
      id: 22,
      category: 'blacharstwo',
      name: 'Wymiana szyb',
      price: '300-1500 zł',
      description: 'Wymiana przedniej, tylnej lub bocznych szyb'
    },
    {
      id: 23,
      category: 'blacharstwo',
      name: 'Naprawa powypadkowa',
      price: 'od 2000 zł',
      description: 'Kompleksowa naprawa pojazdu po kolizji lub wypadku'
    }
  ]

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(service => service.category === selectedCategory)

  return (
    <div className="services">
      <div className="services-header">
        <h1>Nasze usługi i cennik</h1>
        <p>Oferujemy kompleksową obsługę serwisową Twojego pojazdu</p>
      </div>

      <div className="services-note">
        <p>
          <strong>Uwaga:</strong> Podane ceny są orientacyjne. Ostateczna cena
          zostanie ustalona po diagnostyce pojazdu.
        </p>
      </div>

      <div className="category-filters">
        <button
          className={selectedCategory === 'all' ? 'active' : ''}
          onClick={() => setSelectedCategory('all')}
        >
          Wszystkie
        </button>
        <button
          className={selectedCategory === 'mechanika' ? 'active' : ''}
          onClick={() => setSelectedCategory('mechanika')}
        >
          Mechanika
        </button>
        <button
          className={selectedCategory === 'diagnostyka' ? 'active' : ''}
          onClick={() => setSelectedCategory('diagnostyka')}
        >
          Diagnostyka
        </button>
        <button
          className={selectedCategory === 'elektryk' ? 'active' : ''}
          onClick={() => setSelectedCategory('elektryk')}
        >
          Elektryk
        </button>
        <button
          className={selectedCategory === 'klimatyzacja' ? 'active' : ''}
          onClick={() => setSelectedCategory('klimatyzacja')}
        >
          Klimatyzacja
        </button>
        <button
          className={selectedCategory === 'blacharstwo' ? 'active' : ''}
          onClick={() => setSelectedCategory('blacharstwo')}
        >
          Blacharstwo
        </button>
      </div>

      <div className="services-grid">
        {filteredServices.map(service => (
          <div key={service.id} className="service-card">
            <h3>{service.name}</h3>
            <p className="service-description">{service.description}</p>
            <p className="service-price">{service.price}</p>
            <div className="service-category-badge">{service.category}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Services
