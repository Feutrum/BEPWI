# Datenbank-Tabellen

## Legende
- **PK** = Primärschlüssel
- **FK** = Fremdschlüssel
- **UK** = Eindeutiger Schlüssel

---

## 1. Kunden und Vertrieb

### Kunde
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| KID | INT | **PK**, AUTO_INCREMENT | Eindeutige Kunden-ID |
| Name | VARCHAR(100) | NOT NULL | Kundenname |
| Telefon | VARCHAR(20) | | Telefonnummer |
| PLZ | VARCHAR(10) | | Postleitzahl |
| Ort | VARCHAR(50) | | Ort |
| Straße | VARCHAR(100) | | Straßenname |
| Hausnummer | VARCHAR(10) | | Hausnummer |
| IBAN | VARCHAR(34) | | Bankverbindung |

### Angebot
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| ANID | INT | **PK**, AUTO_INCREMENT | Eindeutige Angebots-ID |
| KID | INT | **FK** → Kunde.KID | Verweis auf Kunde |
| Gültigkeit | DATETIME | NOT NULL | Gültigkeitsdatum des Angebots |

### Status_Vertrieb
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| SVID | INT | **PK**, AUTO_INCREMENT | Status-ID |
| Bezeichnung | ENUM | 'gestellt', 'angenommen', 'abgelehnt', 'unbezahlt', 'abgeschlossen' | Vertriebsstatus |

### Lieferumfang
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| LUID | INT | **PK**, AUTO_INCREMENT | Lieferumfang-ID |
| ANID | INT | **FK** → Angebot.ANID | Verweis auf Angebot |
| FID | INT | **FK** → Fahrt.FID | Verweis auf Fahrt |

---

## 2. Lagerverwaltung

### Artikel
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| AID | INT | **PK**, AUTO_INCREMENT | Eindeutige Artikel-ID |
| Bezeichnung | VARCHAR(100) | NOT NULL | Artikelbezeichnung |
| Beschreibung | TEXT | | Detaillierte Beschreibung |

### Bestand
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| BID | INT | **PK**, AUTO_INCREMENT | Bestands-ID |
| STID | INT | **FK** → Standort.STID | Verweis auf Lagerort |
| AID | INT | **FK** → Artikel.AID | Verweis auf Artikel |
| Menge | FLOAT | NOT NULL, >= 0 | Lagermenge |
| Einheit | ENUM | 'kg', 'liter', 'tonnen' | Mengeneinheit |

### Lagerbewegung
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| LBID | INT | **PK**, AUTO_INCREMENT | Bewegungs-ID |
| PID | INT | **FK** → Personal.PID | Verweis auf Personal |
| LUID | INT | **FK** → Lieferumfang.LUID | Verweis auf Lieferumfang |
| Zeit | DATETIME | NOT NULL | Zeitpunkt der Bewegung |

### Standort
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| STID | INT | **PK**, AUTO_INCREMENT | Standort-ID |
| Bezeichnung | VARCHAR(100) | NOT NULL | Standortbezeichnung |
| PLZ | VARCHAR(10) | | Postleitzahl |
| Ort | VARCHAR(50) | | Ort |
| Straße | VARCHAR(100) | | Straßenname |
| Hausnummer | VARCHAR(10) | | Hausnummer |
| Raumnummer | VARCHAR(20) | | Raum-/Hallennummer |

---

## 3. Personal und Zeitwirtschaft

### Personal
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| PID | INT | **PK**, AUTO_INCREMENT | Personal-ID |
| Vorname | VARCHAR(50) | NOT NULL | Vorname |
| Nachname | VARCHAR(50) | NOT NULL | Nachname |
| Geburtsdatum | DATE | NOT NULL | Geburtsdatum |
| PLZ | VARCHAR(10) | | Postleitzahl |
| Ort | VARCHAR(50) | | Wohnort |
| Straße | VARCHAR(100) | | Straßenname |
| Hausnummer | VARCHAR(10) | | Hausnummer |

### Qualifikation
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| QFID | INT | **PK**, AUTO_INCREMENT | Qualifikations-ID |
| PID | INT | **FK** → Personal.PID | Verweis auf Personal |
| Bezeichnung | VARCHAR(100) | NOT NULL | Qualifikationsbezeichnung |
| Zeit | DATE | NOT NULL | Erwerbsdatum |

### Zeit
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| ZID | INT | **PK**, AUTO_INCREMENT | Zeit-ID |
| PID | INT | **FK** → Personal.PID | Verweis auf Personal |
| Von | DATETIME | NOT NULL | Startzeit |
| Bis | DATETIME | NOT NULL | Endzeit |
| Status | ENUM | 'Urlaub', 'Krank', 'geleistet', 'geplant' | Zeitstatus |

### Position
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| PSID | INT | **PK**, AUTO_INCREMENT | Positions-ID |
| Bezeichnung | VARCHAR(100) | NOT NULL | Positionsbezeichnung |
| Sollzeit | FLOAT | NOT NULL, > 0 | Wöchentliche Sollarbeitszeit |
| Gehalt | FLOAT | NOT NULL, >= 0 | Gehalt |

---

## 4. Feld- und Pflanzenmanagement

### Feld
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| FEID | INT | **PK**, AUTO_INCREMENT | Feld-ID |
| Bodenart | VARCHAR(50) | | Bodenart des Feldes |
| Position | VARCHAR(200) | | GPS-Koordinaten oder Beschreibung |

### Aktion
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| AID | INT | **PK**, AUTO_INCREMENT | Aktions-ID |
| FEID | INT | **FK** → Feld.FEID | Verweis auf Feld |
| VBGID | INT | **FK** → Verbrauchsgut.VBGID | Verweis auf Verbrauchsgut |
| Bezeichnung | VARCHAR(100) | NOT NULL | Aktionsbezeichnung |
| VBG_Menge | FLOAT | >= 0 | Verbrauchsgutmenge |
| VBG_Einheit | ENUM | 'kg', 'Liter', 'Tonnen' | Einheit des Verbrauchsguts |

### Verbrauchsgut
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| VBGID | INT | **PK**, AUTO_INCREMENT | Verbrauchsgut-ID |
| Bezeichnung | VARCHAR(100) | NOT NULL | Bezeichnung |
| Aggregatszustand | ENUM | 'fest', 'flüssig' | Zustand des Materials |

### Status_FuPM
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| STFuPMID | INT | **PK**, AUTO_INCREMENT | Status-ID |
| Bezeichnung | ENUM | 'geplant', 'laufend', 'abgeschlossen' | Feldmanagement-Status |

---

## 5. Fuhrpark

### Fahrzeug
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| FZID | INT | **PK**, AUTO_INCREMENT | Fahrzeug-ID |
| MID | INT | **FK** → Modell.MID | Verweis auf Modell |
| Kennzeichen | VARCHAR(15) | **UK**, NOT NULL | Fahrzeugkennzeichen |
| Anschaffung | DATE | NOT NULL | Anschaffungsdatum |
| TUEV | DATE | NOT NULL | TÜV-Termin |

### Modell
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| MID | INT | **PK**, AUTO_INCREMENT | Modell-ID |
| Bezeichnung | VARCHAR(100) | NOT NULL | Modellbezeichnung |
| Gewicht | FLOAT | > 0 | Fahrzeuggewicht in kg |
| Treibstoff | VARCHAR(50) | NOT NULL | Treibstoffart |
| Tankvolumen | FLOAT | > 0 | Tankvolumen in Litern |

### Ausstattung
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| AID | INT | **PK**, AUTO_INCREMENT | Ausstattungs-ID |
| Bezeichnung | VARCHAR(100) | NOT NULL | Ausstattungsbezeichnung |

### Führerschein
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| FSID | INT | **PK**, AUTO_INCREMENT | Führerschein-ID |
| Bezeichnung | VARCHAR(10) | NOT NULL | Führerscheinklasse |

### Fahrt
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| FID | INT | **PK**, AUTO_INCREMENT | Fahrt-ID |
| PID | INT | **FK** → Personal.PID | Verweis auf Fahrer |
| Start_DT | DATETIME | NOT NULL | Startzeit |
| Ende_DT | DATETIME | | Endzeit |
| Start_KM | INT | NOT NULL, >= 0 | Kilometerstand bei Start |
| Ende_KM | INT | >= 0 | Kilometerstand bei Ende |

---

## 6. Externe Partner

### Fahrzeugvermietung
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| FVID | INT | **PK**, AUTO_INCREMENT | Vermietungs-ID |
| Name | VARCHAR(100) | NOT NULL | Firmenname |
| Telefon | VARCHAR(20) | | Telefonnummer |
| PLZ | VARCHAR(10) | | Postleitzahl |
| Ort | VARCHAR(50) | | Ort |
| Straße | VARCHAR(100) | | Straßenname |
| Hausnummer | VARCHAR(10) | | Hausnummer |

### Werkstatt
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| WSID | INT | **PK**, AUTO_INCREMENT | Werkstatt-ID |
| Name | VARCHAR(100) | NOT NULL | Werkstattname |
| Telefon | VARCHAR(20) | | Telefonnummer |
| PLZ | VARCHAR(10) | | Postleitzahl |
| Ort | VARCHAR(50) | | Ort |
| Straße | VARCHAR(100) | | Straßenname |
| Hausnummer | VARCHAR(10) | | Hausnummer |

### Tankstelle
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| TSID | INT | **PK**, AUTO_INCREMENT | Tankstellen-ID |
| Name | VARCHAR(100) | NOT NULL | Tankstellenname |
| Telefon | VARCHAR(20) | | Telefonnummer |
| PLZ | VARCHAR(10) | | Postleitzahl |
| Ort | VARCHAR(50) | | Ort |
| Straße | VARCHAR(100) | | Straßenname |
| Hausnummer | VARCHAR(10) | | Hausnummer |

---

## 7. Beziehungstabellen (Many-to-Many)

### Angebot_Status_Vertrieb
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| ANID | INT | **FK** → Angebot.ANID | Verweis auf Angebot |
| SVID | INT | **FK** → Status_Vertrieb.SVID | Verweis auf Status |
| Zeit | DATETIME | NOT NULL | Zeitpunkt der Statusänderung |
| | | **PK** (ANID, SVID, Zeit) | Zusammengesetzter Primärschlüssel |

### Angebot_Artikel
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| ANID | INT | **FK** → Angebot.ANID | Verweis auf Angebot |
| AID | INT | **FK** → Artikel.AID | Verweis auf Artikel |
| Menge | FLOAT | NOT NULL, > 0 | Angebotsmenge |
| Einheit | ENUM | 'kg', 'Liter', 'Tonnen' | Mengeneinheit |
| | | **PK** (ANID, AID) | Zusammengesetzter Primärschlüssel |

### Lieferumfang_Fahrt
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| LUID | INT | **FK** → Lieferumfang.LUID | Verweis auf Lieferumfang |
| FID | INT | **FK** → Fahrt.FID | Verweis auf Fahrt |
| | | **PK** (LUID, FID) | Zusammengesetzter Primärschlüssel |

### Lagerbewegung_Bestand
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| LBID | INT | **FK** → Lagerbewegung.LBID | Verweis auf Lagerbewegung |
| BID | INT | **FK** → Bestand.BID | Verweis auf Bestand |
| Menge | FLOAT | NOT NULL | Bewegungsmenge |
| Einheit | ENUM | 'kg', 'Liter', 'Tonnen' | Mengeneinheit |
| | | **PK** (LBID, BID) | Zusammengesetzter Primärschlüssel |

### Aktion_Personal
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| AID | INT | **FK** → Aktion.AID | Verweis auf Aktion |
| PID | INT | **FK** → Personal.PID | Verweis auf Personal |
| Aufgabe | TEXT | | Spezielle Aufgabenbeschreibung |
| | | **PK** (AID, PID) | Zusammengesetzter Primärschlüssel |

### Personal_Position
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| PPID | INT | **PK**, AUTO_INCREMENT | Personal-Position-ID |
| PID | INT | **FK** → Personal.PID | Verweis auf Personal |
| PSID | INT | **FK** → Position.PSID | Verweis auf Position |
| Zeit | DATE | NOT NULL | Gültigkeitsdatum |

### Fahrt_Aktion
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| FID | INT | **FK** → Fahrt.FID | Verweis auf Fahrt |
| AID | INT | **FK** → Aktion.AID | Verweis auf Aktion |
| | | **PK** (FID, AID) | Zusammengesetzter Primärschlüssel |

### Aktion_Status_FuPM
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| AID | INT | **FK** → Aktion.AID | Verweis auf Aktion |
| SFuPMID | INT | **FK** → Status_FuPM.STFuPMID | Verweis auf Status |
| Zeit | DATETIME | NOT NULL | Zeitpunkt der Statusänderung |
| | | **PK** (AID, SFuPMID, Zeit) | Zusammengesetzter Primärschlüssel |

### Fahrzeug_Ausstattung
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| AID | INT | **FK** → Ausstattung.AID | Verweis auf Ausstattung |
| FZID | INT | **FK** → Fahrzeug.FZID | Verweis auf Fahrzeug |
| | | **PK** (AID, FZID) | Zusammengesetzter Primärschlüssel |

### Fahrzeug_Werkstatt
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| FZWSID | INT | **PK**, AUTO_INCREMENT | Fahrzeug-Werkstatt-ID |
| WSID | INT | **FK** → Werkstatt.WSID | Verweis auf Werkstatt |
| FZID | INT | **FK** → Fahrzeug.FZID | Verweis auf Fahrzeug |
| Start | DATETIME | NOT NULL | Wartungsbeginn |
| Ende | DATETIME | | Wartungsende |
| Zweck | TEXT | | Wartungszweck |

### Modell_Führerschein
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| MID | INT | **FK** → Modell.MID | Verweis auf Modell |
| FSID | INT | **FK** → Führerschein.FSID | Verweis auf Führerschein |
| | | **PK** (MID, FSID) | Zusammengesetzter Primärschlüssel |

### Personal_Führerschein
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| PID | INT | **FK** → Personal.PID | Verweis auf Personal |
| FSID | INT | **FK** → Führerschein.FSID | Verweis auf Führerschein |
| | | **PK** (PID, FSID) | Zusammengesetzter Primärschlüssel |

### Fahrzeug_Fahrt
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| FZID | INT | **FK** → Fahrzeug.FZID | Verweis auf Fahrzeug |
| FID | INT | **FK** → Fahrt.FID | Verweis auf Fahrt |
| | | **PK** (FZID, FID) | Zusammengesetzter Primärschlüssel |

### Fahrzeug_Standort
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| FZSTID | INT | **PK**, AUTO_INCREMENT | Fahrzeug-Standort-ID |
| FZID | INT | **FK** → Fahrzeug.FZID | Verweis auf Fahrzeug |
| STID | INT | **FK** → Standort.STID | Verweis auf Standort |
| Start | DATETIME | NOT NULL | Ankunftszeit |
| Ende | DATETIME | | Abfahrtszeit |

### Fahrt_Standort
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| FSTID | INT | **PK**, AUTO_INCREMENT | Fahrt-Standort-ID |
| FID | INT | **FK** → Fahrt.FID | Verweis auf Fahrt |
| STID | INT | **FK** → Standort.STID | Verweis auf Standort |
| Typ | ENUM | 'Abfahrt', 'Ankunft' | Fahrttyp |

### Personal_Tankstelle
| Feldname | Datentyp | Constraints | Beschreibung |
|----------|----------|-------------|--------------|
| PTSID | INT | **PK**, AUTO_INCREMENT | Personal-Tankstelle-ID |
| PID | INT | **FK** → Personal.PID | Verweis auf Personal |
| TSID | INT | **FK** → Tankstelle.TSID | Verweis auf Tankstelle |
| Treibstoffart | VARCHAR(50) | NOT NULL | Art des Treibstoffs |
| Menge | FLOAT | NOT NULL, > 0 | Getankte Menge |
| Preis_pro_Liter | FLOAT | NOT NULL, > 0 | Preis pro Liter |
| Zeit | DATETIME | NOT NULL | Tankzeitpunkt |
| KM_Anzahl | INT | NOT NULL, >= 0 | Kilometerstand |