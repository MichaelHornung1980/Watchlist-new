import React from 'react'
import GruppenTag from './components/GruppenTag'
import GruppenDialog from './components/GruppenDialog'
import Modell from './model/Shopping'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.initialisieren()
    this.state = {
      aktiveGruppe: null,
      showGruppenDialog: false,
      showSortierDialog: false,
      einkaufenAufgeklappt: true,
      erledigtAufgeklappt: false
    }
  }

  initialisieren() {
    let neocaridinia = Modell.gruppeHinzufuegen("Neocaridinia")
    let garnele1 = neocaridinia.artikelHinzufuegen("Blue Jelly")
    garnele1.gekauft = true
    neocaridinia.artikelHinzufuegen("Blue Dream")
    let caradina = Modell.gruppeHinzufuegen("Caradina")
    let garnele2 = caradina.artikelHinzufuegen("Black Bee")
    garnele2.gekauft = true
    caradina.artikelHinzufuegen("Red Bee")
    let skyfish = Modell.gruppeHinzufuegen("Skyfish Shrimps")
    let garnele3 = skyfish.artikelHinzufuegen("Red Mosura Tiger")
    garnele3.gekauft = true
    skyfish.artikelHinzufuegen("Blue Boa")
  }

  einkaufenAufZuKlappen() {
    let neuerZustand = !this.state.einkaufenAufgeklappt
    this.setState({einkaufenAufgeklappt: neuerZustand})
  }

  erledigtAufZuKlappen() {
    this.setState({erledigtAufgeklappt: !this.state.erledigtAufgeklappt})
  }

  artikelChecken = (artikel) => {
    artikel.gekauft = !artikel.gekauft
    const aktion = (artikel.gekauft) ? "erledigt" : "reaktiviert"
    Modell.informieren("[App] Artikel \"" + artikel.name + "\" wurde " + aktion)
    this.setState(this.state)
  }

  artikelHinzufuegen() {
    // ToDo: implementiere diese Methode
    const eingabe = document.getElementById("artikelEingabe")
    const artikelName = eingabe.value.trim()
    if (artikelName.length > 0) {
      Modell.aktiveGruppe.artikelHinzufuegen(artikelName)
      this.setState(this.state)
    }
    eingabe.value = ""
    eingabe.focus()
  }

  setAktiveGruppe(gruppe) {
    Modell.aktiveGruppe = gruppe
    Modell.informieren("[App] Gruppe \"" + gruppe.name + "\" ist nun aktiv")
    this.setState({aktiveGruppe: Modell.aktiveGruppe})
  }

  render() {
    let nochZuKaufen = []
    if (this.state.einkaufenAufgeklappt == true) {
      for (const gruppe of Modell.gruppenListe) {
        nochZuKaufen.push(<GruppenTag
          key={gruppe.id}
          gruppe={gruppe}
          gekauft={false}
          aktiv={gruppe == this.state.aktiveGruppe}
          aktiveGruppeHandler={() => this.setAktiveGruppe(gruppe)}
          checkHandler={this.artikelChecken}/>)
      }
    }

    let schonGekauft = []
    if (this.state.erledigtAufgeklappt) {
      for (const gruppe of Modell.gruppenListe) {
        schonGekauft.push(<GruppenTag
          key={gruppe.id}
          gruppe={gruppe}
          gekauft={true}
          aktiveGruppeHandler={() => this.setAktiveGruppe(gruppe)}
          checkHandler={this.artikelChecken}/>)
      }
    }

    let gruppenDialog = ""
    if (this.state.showGruppenDialog) {
      gruppenDialog = <GruppenDialog
        gruppenListe={Modell.gruppenListe}
        onDialogClose={() => this.setState({showGruppenDialog: false})}/>
    }

    return (
      <div id="container">
        <header>
          <h1>Watchlist</h1>
          <label
            className="mdc-text-field mdc-text-field--filled mdc-text-field--with-trailing-icon mdc-text-field--no-label">
            <span className="mdc-text-field__ripple"></span>
            <input className="mdc-text-field__input" type="search"
                   id="artikelEingabe" placeholder="Artikel hinzuf??gen"
                   onKeyPress={e => (e.key == 'Enter') ? this.artikelHinzufuegen() : ''}/>
            <span className="mdc-line-ripple"></span>
            <i className="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
               tabIndex="0" role="button"
               onClick={() => this.artikelHinzufuegen()}>add_circle</i>
          </label>

        </header>
        <hr/>

        <main>
          <section>
            <h2>Noch zu kaufen
              <i onClick={() => this.einkaufenAufZuKlappen()} className="material-icons">
                {this.state.einkaufenAufgeklappt ? 'expand_more' : 'expand_less'}
              </i>
            </h2>
            <dl>
              {nochZuKaufen}
            </dl>
          </section>
          <hr/>
          <section>
            <h2>Schon gekauft
              <i onClick={() => this.erledigtAufZuKlappen()} className="material-icons">
                {this.state.erledigtAufgeklappt ? 'expand_more' : 'expand_less'}
              </i>
            </h2>
            <dl>
              {schonGekauft}
            </dl>
          </section>
        </main>
        <hr/>

        <footer>
          <button className="mdc-button mdc-button--raised"
                  onClick={() => this.setState({showGruppenDialog: true})}>
            <span className="material-icons">bookmark_add</span>
            <span className="mdc-button__ripple"></span> Gruppen
          </button>
          <button className="mdc-button mdc-button--raised">
            <span className="material-icons">sort</span>
            <span className="mdc-button__ripple"></span> Sort
          </button>
          <button className="mdc-button mdc-button--raised">
            <span className="material-icons">settings</span>
            <span className="mdc-button__ripple"></span> Setup
          </button>
        </footer>

        {gruppenDialog}
      </div>
    )
  }
}

export default App
