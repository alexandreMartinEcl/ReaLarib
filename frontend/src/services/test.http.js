/**
 * Cette classe permet de bousculer du mode online à local facilement
 * Chaque requête réalisée dans les .repository passe par ici
 * Si agent.local, cela renvoie aux fonctions ci-dessous renvoyant un exemple donnée de réponse
 * Si agent.online, cela renvoie à superagent
 *  Ce middleware permet l'authentifiation à chaque requête
 */
function localGetUnites() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        body: {
          success: true,
          result: {
            unites: [
              {
                nom: "Hégoa",
                lits: [
                  {
                    idLit: "1",
                    patient: {
                      idPatient: "1",
                      nomFamille: "Lol",
                      prenom: "moi",
                      dateNaissance: new Date("01/01/1989"),
                      dateHospitalisation: new Date("29/03/2020"),
                      diagnosticPrincipal: "Covid",
                      nbDeDefaillances: 1,
                      gravite: "grave",
                    },
                    etat: "occupé",
                  },
                  {
                    idLit: "2",
                    patient: {
                      idPatient: "2",
                      nomFamille: "Avril",
                      prenom: "Henry",
                      dateNaissance: new Date("01/01/1989"),
                      dateHospitalisation: new Date("29/03/2020"),
                      diagnosticPrincipal: "Covid",
                      nbDeDefaillances: 0,
                      gravite: "à surveiller",
                    },
                    etat: "occupé",
                  },
                  {
                    idLit: "3",
                    patient: {
                      idPatient: "3",
                      nomFamille: "Achille",
                      prenom: "François",
                      dateNaissance: new Date("01/01/1989"),
                      dateHospitalisation: new Date("29/03/2020"),
                      diagnosticPrincipal: "Covid",
                      nbDeDefaillances: 0,
                      gravite: "simple",
                    },
                    etat: "occupé",
                  },
                  {
                    idLit: "4",
                    patient: {},
                    etat: "libre",
                  },
                  {
                    idLit: "6",
                    patient: {},
                    etat: "libre",
                  },
                  {
                    idLit: "5",
                    patient: {},
                    etat: "libre",
                  },
                ],
              },
              {
                nom: "Sirroco",
                lits: [
                  {
                    idLit: "1",
                    patient: {},
                    etat: "libre",
                  },
                  {
                    idLit: "2",
                    patient: {},
                    etat: "libre",
                  },
                  {
                    idLit: "3",
                    patient: {},
                    etat: "indisponible",
                  },
                ],
              },
            ],
          },
        },
      });
    }, 1000);
  });
}

function localGetPatient(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        body: {
          success: true,
          result: {
            patient: {
              lit: {
                idLit: 1,
                uniteId: "Hégoa",
              },
              infoPerso: {
                idPatient: id,
                nomFamille: "Avril",
                prenom: "Henry",
                dateNaissance: new Date("01/01/1989"),
              },
              diagnostic: {
                depistages: {
                  covid: false,
                  orlEntree: false,
                  ERentree: false,
                  ERpremierMardi: false,
                  ERsecondMardi: false,
                },
                antecedents: [
                  {
                    type: "cardio",
                    statut: "note du medecin",
                  },
                ],
                allergies: "inconnu",
                gravite: "simple",
              },
              historiqueSoins: [
                {
                  date: null,
                  soin: null,
                },
              ],
              historiqueEtats: [
                {
                  jour: 1,
                  modeVentilatoire: "r",
                  PF: "p",
                  DV: "d",
                  sedation: "r",
                  curares: "r",
                  nad: "r",
                  creat: "r",
                },
                {
                  jour: 2,
                  modeVentilatoire: "r",
                  PF: "p",
                  DV: "d",
                  sedation: "r",
                  curares: "r",
                  nad: "r",
                  creat: "r",
                },
                {
                  jour: 3,
                  modeVentilatoire: "r",
                  PF: "p",
                  DV: "d",
                  sedation: "r",
                  curares: "r",
                  nad: "r",
                  creat: "r",
                },
              ],
              todoList: [
                {
                  aFaire: "verfier la tension",
                  estRealise: false,
                  dateEmission: null,
                  dateRealisation: null,
                  medecinEmetteur: "Alan Bernard",
                },
              ],
            },
          },
        },
      });
    }, 1000);
  });
}

function localCreatePatient(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        body: {
          success: true,
          result: {
            patient: {
              lit: {
                idLit: params.lit.idLit,
                uniteId: params.lit.uniteId,
              },
              infoPerso: {
                idPatient: 126,
                nomFamille: params.patient.nomFamille,
                prenom: params.patient.prenom,
                dateNaissance: params.patient.dateNaissance,
              },
            },
          },
        },
      });
    });
  });
}

function localUpdatePatient(id) {
  return (params) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          body: {
            success: true,
            result: {
              patient: {
                lit: {
                  idLit: params.lit.idLit,
                  uniteId: params.lit.uniteId,
                },
                infoPerso: {
                  idPatient: id,
                  nomFamille: params.patient.nomFamille,
                  prenom: params.patient.prenom,
                  dateNaissance: params.patient.dateNaissance,
                },
              },
            },
          },
        });
      });
    });
  };
}

const localHttp = {
  get: (url) => {
    if (url === "/api/unites/list") {
      return localGetUnites();
    } else if (url.startsWith("/api/patient")) {
      const id = url.split("/")[-1];
      return localGetPatient(id);
    }
    return null;
  },
  post: (url) => {
    if (url === "/api/unites/list") {
      return {
        send: localCreatePatient,
      };
    }
    return null;
  },
  put: (url) => {
    if (url.startsWith("/api/patients")) {
      const id = url.split("/")[-1];
      return {
        send: localUpdatePatient(id),
      };
    }
  },
};

export default localHttp;
