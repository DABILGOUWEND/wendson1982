import { computed, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, concat, forkJoin, map, of, pipe, switchMap, tap } from "rxjs";
import {
    gasoilStore, tab_ProjetStore, ApprogoStore, Tab_EnginsStore,
    Tab_classeEnginsStore, Tab_personnelStore, tab_SoustraitantStore, tab_PannesStore,
    tab_ressourcesStore, tab_famillesStore, tab_categoriesStore, tab_compositesStore,
    tab_contratStore, tab_pointageStore, tab_travauxStore, tab_naturetvxStore, tab_dateStore,
    Engins, Gasoil, Pannes, Projet, classe_engins, sous_traitant, tab_personnel, tab_ressources,
    tab_userStore, Users, travaux, datesPointages, appro_gasoil, Contrats, pointage, nature_travaux,
    tab_satatutStore, tab_DevisStore, tab_LigneDevisStore, Devis, Ligne_devis, tab_constatStore,
    tab_AttachementStore,
    tab_DecompteStore,
    Constats,
    ModelAttachement,
    ModelDecompte,
    tab_tachesStore,
    tab_unitesStore,
    tab_tachesEnginsStore,
    tab_tachesProjetStore,
    tab_EntrepriseStore,
    tab_Pannes,
    tab_pointage_travauxStore,
    pointage_travaux,
    comptes,
    Task
} from "../models/modeles"
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { WenService } from "../wen.service";
import { v4 as uuidv4 } from 'uuid';
import { Auth, authState, user } from "@angular/fire/auth";
import { TaskService } from "../task.service";
import { DateAdapter } from "@angular/material/core";
import { PassThrough } from "node:stream";
import { ComptesDateInitService } from "../services/comptes-date-init.service";
import { error } from "node:console";
const initialGasoilState: gasoilStore = {
    conso_data: [],
    err: null,
    selectedDate: [''],
    message: '',
    date_jour: '',
    selectedEngin: "",
    selectedClass: '',
    path_string: ''
}

///projet
const initialProjetState: tab_ProjetStore =
{
    projets_data: [],
    err: null,
    selectedId: '',
    message: '',
    path_string: ''
}
//devis
const initialDevisState: tab_DevisStore =
{
    devis_data: [],
    message: '',
    selectedEntreprise_id: '',
    selectedProjet_id: '',
    path_string: '',
    current_devis_id: '',
    current_devis: undefined


}
//ligne devis
const initialLigneDevisState: tab_LigneDevisStore =
{
    lignedevis_data: [],
    message: '',
    selectedDevis_id: '',
    path_string: ''
}

const initialApprogoState: ApprogoStore = {
    approgo_data: [],
    err: null,
    path_string: ''
}
const initialEnginState: Tab_EnginsStore = {
    engins: [],
    message: '444777',
    selectedId: '',
    selectedClasseId: '',
    selectedDesignation: '',
    selectedIds: [''],
    path_string: ''
}
const initialClassesE: Tab_classeEnginsStore = {
    classes: [],
    message: '',
    selectedId: '',
    path_string: ''
}
const initialPersonnelState: Tab_personnelStore = {
    personnel_data: [],
    err: null,
    selectedId: '',
    selectedNom_prenom: '',
    message: '',
    current_date: '',
    click: [-1],
    path_string: ''


}
const initialSstraitantState: tab_SoustraitantStore =
{
    sstraitant_data: [],
    err: '',
    selectedId: '',
    message: '',
    path_string: ''
}
const initialPannesState: tab_PannesStore =
{
    pannes_data: [],
    err: '',
    selectedId: '',
    message: '',
    intervalleDate: [''],
    EnginsIds: [''],
    path_string: ''
}
const initialResourcesState: tab_ressourcesStore = {
    ressources_data: [],
    message: '',
    selectedId: '',
    selectedIds: [''],
    selectedCatId: '',
    selectedFamId: ''
}
const initialFamillesState: tab_famillesStore = {
    familles_data: [],
    message: '',
    selectedId: '',
    selectedIds: ['']
}
const initialCategorieState: tab_categoriesStore = {
    categories_data: [],
    message: '',
    selectedId: '',
    selectedIds: ['']
}
const initialCompositesState: tab_compositesStore = {
    composites_data: [],
    message: '',
    selectedId: '',
    selectedIds: ['']
}
const initialContratStore: tab_contratStore = {
    contrats_data: [],
    message: '',
    selectedId: '',
    selectedIds: [''],

}
const initialPointageStore: tab_pointageStore =
{
    pointage_data: [],
    message: '',
    selectedId: '',
    selectedIds: ['']
}

const initialTravauxStore: tab_travauxStore =
{
    travaux_data: [],
    message: '',
    selectedId: '',
    selectedIds: [''],
    selectedDate: ''
}

const initialNatureTrvxStore: tab_naturetvxStore =
{
    nature_tvx_data: [],
    message: '',
    selectedId: '',
    selectedIds: ['']
}
const initialDatesState: tab_dateStore =
{
    dates: [],
    message: '',
    selectedId: ''
}
const initialUserState: tab_userStore =
{
    users_data: [],
    url: '/accueil',
    nivo_requis: 0,
    message: '',
    user: 'ff'
}

const initialStatutState: tab_satatutStore =
{
    statut_data: [],
    message: '',
    path_string: ''

}
const initialConstatState: tab_constatStore =
{
    constat_data: [],
    message: '',
    selected_poste_id: '',
    selected_devis_id: '',
    selected_dp: 0,
    path_string: ''
}
const initialAttachementState: tab_AttachementStore =
{
    attachement_data: [],
    message: '',
    selected_devis_id: '',
    selected_num: 0,
    path_string: ''
}
const initialDecompteState: tab_DecompteStore =
{
    decompte_data: [],
    message: '',
    selected_attach_id: '',
    selected_num: 0,
    path_string: ''
}
const initialTachesState: tab_tachesStore =
{
    message: '',
    taches_data: [],
    selected_type: '',
    path_string: ''
}

const initialUnitesState: tab_unitesStore =
{
    message: '',
    unites_data: [],
    path_string: ''
}
const initialTacheEnginsState: tab_tachesEnginsStore =
{
    selectedId: '',
    message: '',
    taches_data: [],
    path_string: ''
}
const initialEntrepriseState: tab_EntrepriseStore =
{
    selectedId: '',
    message: '',
    liste_entreprise: []
}

const initialTacheProjetState: tab_tachesProjetStore =
{
    selectedId: '',
    message: '',
    taches_data: [],
    selectedProjetId: '',
    selectedTacheId: ''
}
const initialPointageTrvxState: tab_pointage_travauxStore =
{
    selectedId: '',
    message: '',
    pointage_data: [],
    selectedDate: '',
    selectedProjetId: '',
    pointage_mach: []
}
const initialCompte: comptes =
{
    engins: [],
    personnel: [],
    classes_engins: [],
    appro_go: [],
    conso_go: [],
    pannes: [],
    current_user: undefined,
    selected_engin: '',
    selected_personnel: ''
}
/*************************** */
export const UserStore = signalStore(
    { providedIn: 'root' },
    withState(initialUserState),
    withComputed((store) => (
        {
            taille: computed(() => store.users_data().length),
            users: computed(() => {
                return store.users_data()
            }),
            getUrl: computed(() => store.url())
            ,
            getNivo: computed(() => store.nivo_requis())
        }
    )
    ),
    withMethods((store, _task_service = inject(TaskService), snackbar = inject(MatSnackBar), _auth = inject(Auth)) =>
    (
        {
            setUrl(url: string) {
                patchState(store, { url: url })
            },
            setNivo(nivo: number) {
                patchState(store, { nivo_requis: nivo })
            },

            loadUsers: rxMethod<void>(pipe(switchMap(() => {
                return _task_service.getallModels("myusers").pipe(
                    tap((data) => {
                        patchState(store, { users_data: data })
                    })
                )
            }
            ))),
            addUser: rxMethod<any>(pipe(
                switchMap((personnel) => {
                    return _task_service.addModel("myusers", personnel).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            },
                            error: () => {
                                patchState(store, { message: 'echoué' });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            removeUser: rxMethod<string>(pipe(
                switchMap((id) => {
                    return _task_service.deleteModel("myusers", id).pipe(tap({
                        next: () => {

                            Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                        },
                        error: () => {
                            patchState(store, { message: 'echoué' });
                            Showsnackerbaralert('échoué', 'fail', snackbar)
                        }
                    }
                    ))
                }))),
            updateUser: rxMethod<tab_personnel>(pipe(
                switchMap((user) => {
                    return _task_service.updateModel("myusers", user).pipe(
                        tap({
                            next: () => {

                                Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            },
                            error: () => {
                                patchState(store, { message: 'echoué' });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),

        }
    ))
)
export const ProjetStore = signalStore(
    { providedIn: 'root' },
    withState(initialProjetState),
    withComputed((store) => (
        {
            taille: computed(() => store.projets_data().length),
            donnees_projet: computed(() => {
                return classeProjet(store.projets_data())
            }),
            donnees_projetById: computed(() => {
                var ind = store.selectedId
                let data: Projet | undefined = store.projets_data().find(x => x.id == ind())
                return data
            })
        }
    )
    ),
    withMethods((store, _task_service = inject(TaskService),
        _compte_data = inject(ComptesDateInitService),
        snackbar = inject(MatSnackBar)) =>
    (
        {

            filtrebyId(id: string) {
                patchState(store, { selectedId: id })
            },
            loadProjets: rxMethod<void>(pipe(switchMap(() => {
                return _task_service.getallProjets().pipe(
                    tap((data) => {
                        patchState(store, { projets_data: classeProjet(data) })
                    })
                )
            }
            ))),
            addProjet: rxMethod<Projet>(pipe(
                switchMap((projet) => {
                    return _task_service.addProjets(projet).pipe(
                        tap(resp => {
                            let obsrv: Observable<any>[] = [];
                            if (resp != "") {
                                _compte_data.upload_data("unites", "unites", resp)
                                _compte_data.upload_data("satut", "statuts_personnel", resp)
                                _compte_data.upload_data("classes", "classes_engins", resp)
                            }
                        }
                        )
                    )
                })
            )),
            removeProjet: rxMethod<string>(pipe(
                switchMap((id) => {
                    return _task_service.deleteProjets(id).pipe(tap({
                        next: () => {
                            Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                        },
                        error: () => {
                            patchState(store, { message: 'echoué' });
                            Showsnackerbaralert('échoué', 'fail', snackbar)
                        }
                    }

                    ))
                }))),
            updateProjet: rxMethod<Projet>(pipe(
                switchMap((projet) => {
                    return _task_service.updateProjets(projet).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            }, error: () => {
                                patchState(store, { message: 'echoué' });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),

        }
    ))
)
export const EnginsStore = signalStore(
    { providedIn: 'root' },
    withState(initialEnginState),
    withComputed((
        store,
        classe_store = inject(ClasseEnginsStore),
        monservice = inject(PersonnelStore),

    ) => (
        {
            taille: computed(() => store.engins().length),
            donnees_engins: computed(() => {
                var mot = store.selectedDesignation()
                if (mot == '') { return classeEngins(store.engins()) }
                else {
                    return classeEngins(store.engins().filter(x => (x.designation).toLowerCase().includes(mot.toLowerCase())))
                }

            }),
            donnees_utilisateur: computed(() => {
                var mot = store.selectedDesignation()
                let donnee = []
                if (mot == '') { donnee = classeEngins(store.engins()) }
                else {
                    donnee = classeEngins(store.engins().filter(x => (x.designation).toLowerCase().includes(mot.toLowerCase())))
                }

                let data = monservice.donnees_personnel()
                let onedata = donnee.map(x => x.utilisateur_id)
                var mydata: string[] = []
                onedata.forEach(element => {
                    let trouv = data.find(x => x.id == element)
                    if (trouv) {
                        mydata.push(trouv.nom + ' ' + trouv.prenom)
                    }
                    else {
                        mydata.push('')
                    }
                });
                return mydata
            }),
            donnees_classes: computed(() => {
                var mot = store.selectedDesignation()
                let donnee = []
                if (mot == '') { donnee = classeEngins(store.engins()) }
                else {
                    donnee = classeEngins(store.engins().filter(x => (x.designation).toLowerCase().includes(mot.toLowerCase())))
                }
                let data = classe_store.classes_engins()
                let onedata = donnee.map(x => x.classe_id)
                var mydata: string[] = []
                onedata.forEach(element => {
                    let trouv = data.find(x => x.id == element)
                    if (trouv) {
                        mydata.push(trouv.designation)
                    }
                    else {
                        mydata.push('')
                    }
                });
                return mydata

            }),
            donnees_enginsById: computed(() => {
                var ind = store.selectedId
                let data: Engins | undefined = store.engins().find(x => x.id == ind())
                return data
            }),
            donnees_enginsByIds: computed(() => {
                var ind = store.selectedIds
                if (ind()[0] == '') {
                    return store.engins()
                }
                else {
                    let data: Engins[] = store.engins().filter(x => ind().includes(x.id))
                    return data
                }

            }),

            donnees_enginsByClasse: computed(() => {
                var ind = store.selectedClasseId
                return store.engins().filter(x => x.classe_id == ind())
            })
        }
    )
    ),
    withMethods((
        store,
        _task_service = inject(TaskService),
        compte = inject(CompteStore),
        snackbar = inject(MatSnackBar)) =>
    (
        {
            setPathString(path: string) {
                patchState(store, { path_string: path })
            }
            ,
            filtrebyId(id: string) {
                patchState(store, { selectedId: id })
            },
            filtrebyIds(ids: string[]) {
                patchState(store, { selectedIds: ids })
            },
            filtrebyClasseId(id: string | undefined) {
                patchState(store, { selectedClasseId: id })
            },
            filterbyDesignation(mot: string) { patchState(store, { selectedDesignation: mot }) },
            load_compte_engins() {
                patchState(store, { engins: compte.engins() })
            },
            loadengins: rxMethod<void>(pipe(switchMap(() => {
                return _task_service.getallModels(store.path_string()).pipe(
                    tap((data) => {
                        patchState(store, { engins: data })
                    })
                )
            }
            )))
            ,
            addEngin: rxMethod<Engins>(pipe(
                switchMap((engin) => {
                    return _task_service.addModel(store.path_string(), engin).pipe(
                        tap({
                            next: (resp) => {
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            },
                            error: (err) => {
                                patchState(store, { message: 'echoué' });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            deleteEngin: rxMethod<string>(pipe(
                switchMap((id) => {
                    return _task_service.deleteModel(store.path_string(), id).pipe(tap({
                        next: () => {

                            Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                        }, error: (err) => {
                            patchState(store, { message: 'echoué' });
                            Showsnackerbaralert('échoué', 'fail', snackbar)
                        }
                    }

                    ))
                }))),
            updateEngin: rxMethod<Engins>(pipe(
                switchMap((engin) => {
                    return _task_service.updateModel(store.path_string(), engin).pipe(
                        tap({
                            next: () => {

                                Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            }
                            ,
                            error: (err) => {
                                patchState(store, { message: 'echoué' });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),

        }
    ))
)
export const ClasseEnginsStore = signalStore(
    { providedIn: 'root' },
    withState(initialClassesE),
    withComputed((store) => (
        {
            taille: computed(() => store.classes().length),
            classes_engins: computed(() => {
                return classement_classes(store.classes())
            }),
            classes_enginsById: computed(() => {
                var ind = store.selectedId
                let data: classe_engins | undefined = store.classes().find(x => x.id == ind())
                return data
            })

        }
    )
    ),
    withMethods((store,
        monservice = inject(WenService),
        _taskk_service = inject(TaskService),
        snackbar = inject(MatSnackBar),
        compte = inject(CompteStore)) =>
    (
        {
            setPathString(path: string) {
                patchState(store, { path_string: path })
            },

            filtrebyId(id: string) {
                patchState(store, { selectedId: id })
            },
            loadclasses: rxMethod<void>(pipe(switchMap(() => {
                return _taskk_service.getallModels(store.path_string()).pipe(
                    tap((data) => {
                        patchState(store, { classes: classement_classes(data) })
                    })
                )
            }
            ))),

            addClasse: rxMethod<any>(pipe(
                switchMap((classe) => {
                    return _taskk_service.addModel(store.path_string(), classe).pipe(
                        tap({
                            next: (resp) => {
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            },
                            error: (err) => {
                                patchState(store, { message: 'echoué' });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            deleteClasse: rxMethod<string>(pipe(
                switchMap((id) => {
                    return _taskk_service.deleteModel(store.path_string(), id).pipe(
                        tap({
                            next: (resp) => {
                                Showsnackerbaralert('supprimé!', 'pass', snackbar)
                            },
                            error: (err) => {
                                patchState(store, { message: 'echoué' });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                }))),
            updateClasses: rxMethod<any>(pipe(
                switchMap((classe) => {
                    return _taskk_service.updateModel(store.path_string(), classe).pipe(
                        tap({
                            next: (resp) => {
                                Showsnackerbaralert('Modifié avec succes', 'pass', snackbar)
                            },
                            error: (err) => {
                                patchState(store, { message: 'echoué' });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            ))

        }
    ))
)
export const PersonnelStore = signalStore(
    { providedIn: 'root' },
    withState(initialPersonnelState),
    withComputed((store, dates = inject(DatesStore)) => (
        {
            taille: computed(() => store.personnel_data().length),
            donnees_personnel: computed(() => {
                var mot = store.selectedNom_prenom()
                if (mot == '') {
                    return classePersonnel(store.personnel_data())
                }
                else {
                    return classePersonnel(store.personnel_data().filter(x => (x.nom + x.prenom).toLowerCase().includes(mot.toLowerCase())))
                }
            }),
            mytasks: computed(() => {
                let personnel = store.personnel_data();
                let data: any = [];
                personnel.forEach((element) => {
                    let dates = element.dates;
                    let presence = element.presence;
                    let index = dates.indexOf(store.current_date());
                    if (index > 0) {
                        data.push({
                            name: presence[index] ? "présent" : "absent",
                            completed: element.presence[index],
                        })
                    }

                });
                return {
                    name: 'selectionner tout',
                    completed: false,
                    subtasks: data,
                }
            }),
            getDates: computed(() => {
                let personnel = store.personnel_data();
                let dates = personnel.map(x => x.dates);
                let result: any = []
                dates.forEach(element => {
                    result = [...result, ...element]
                });
                let unique_dates = result.filter((value: any, index: any, self: any) => self.indexOf(value) === index);
                return unique_dates
            })

            ,

            data_pointage: computed(() => {
                let donnees = store.personnel_data();
                let data: tab_personnel[] = [];
                donnees.forEach(element => {
                    let dates = element.dates;
                    if (dates.includes(store.current_date()))
                        data.push(element)
                });
                return data
            }),
            donnees_personnelById: computed(() => {
                var ind = store.selectedId
                let data: tab_personnel | undefined = store.personnel_data().find(x => x.id == ind())
                return data
            }),
            rechercheDate: computed(() => {
                let date = store.current_date()
                let data: tab_personnel[] = []
                store.personnel_data().forEach(element => {
                    let mydates = element.dates
                    let ind = mydates.lastIndexOf(date)
                    if (ind != -1)
                        data.push(element)
                });
                return data
            }),
            heures_normale: computed(() => {
                let date = store.current_date()
                let filtre = store.personnel_data().filter(x => x.dates.includes(date))
                let data: any = []
                filtre.forEach(element => {
                    let mydates = element.dates
                    let heureN = element.heuresN
                    let ind = mydates.lastIndexOf(date)
                    if (ind != -1) {
                        data.push(heureN[ind])
                    }
                    else {
                        data.push(0)
                    }
                });
                return data
            }),
            heures_sup: computed(() => {
                let date = store.current_date()
                let filtre = store.personnel_data().filter(x => x.dates.includes(date))
                let data: any = []
                filtre.forEach(element => {
                    let mydates = element.dates
                    let heureS = element.heureSup
                    let ind = mydates.lastIndexOf(date)
                    if (ind != -1) {
                        data.push(heureS[ind])
                    }
                    else {
                        data.push(0)
                    }
                });
                return data
            }),
            no_pointage: computed(() => {
                let data: any = []
                let date = store.current_date()
                let mydata = store.personnel_data().filter(x => !x.dates.includes(date))
                mydata.forEach(element => {
                    data.push({
                        names: element
                    })
                });
                return data
            }),
            ischecked: computed(() => {
                let data: any = []
                let date = store.current_date()
                let names = store.personnel_data().filter(x => !x.dates.includes(date))
                names.forEach(element => {
                    data.push(false
                    )
                });
                return data
            }),
            presence: computed(() => {
                let date = store.current_date()
                let data: any = []
                let filtre = store.personnel_data().filter(x => x.dates.includes(date))
                filtre.forEach(element => {
                    let mydates = element.dates
                    let presence = element.presence
                    let ind = mydates.lastIndexOf(date)
                    if (ind != -1) {
                        data.push(presence[ind])
                    }
                    else {
                        data.push(true)
                    }
                });
                return data
            }),
            is_present: computed(() => {
                let date = store.current_date()
                let data: any = []
                let filtre = store.personnel_data().filter(x => x.dates.includes(date))
                filtre.forEach(element => {
                    let mydates = element.dates
                    let presence = element.presence
                    let ind = mydates.indexOf(date, 0)
                    if (ind != -1) {
                        if (presence[ind]) {
                            data.push('présent')
                        }
                        else {
                            data.push('absent')
                        }
                    }
                    else {
                        data.push('absent')
                    }
                });
                return data
            })

        }
    )
    ),
    withMethods((store,
        task_service = inject(TaskService),
        snackbar = inject(MatSnackBar)) =>
    (
        {
            setPathString(path: string) {
                patchState(store, { path_string: path })
            },
            filtrebyId(id: string) {
                patchState(store, { selectedId: id })
            },
            filtrebyDate(date: string) {
                patchState(store, { current_date: date })
            },
            setClick(types: number[]) {
                patchState(store, { click: types })
            },

            filterbyNomPrenom(mot: string) { patchState(store, { selectedNom_prenom: mot }) },

            loadPersonnel: rxMethod<void>(pipe(switchMap(() => {
                return task_service.getallPersonnel().pipe(
                    tap(data => {
                        patchState(store, { personnel_data: classePersonnel(data) })
                    })
                )
            }
            ))),
            addPersonnel: rxMethod<any>(pipe(
                switchMap((personnel) => {
                    return task_service.addModel(store.path_string(), personnel).pipe(
                        tap({
                            next: () => {
                                const updatedonnes = [...store.personnel_data(), personnel]
                                patchState(store, { personnel_data: updatedonnes })
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            },
                            error: () => {
                                patchState(store, { message: 'echoué' });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            removePersonnel: rxMethod<string>(pipe(
                switchMap((id) => {
                    return task_service.deleteModel(store.path_string(), id).pipe(tap({
                        next: () => {
                            const updatedonnes = store.personnel_data().filter(x => x.id != id)
                            patchState(store, { personnel_data: updatedonnes })
                            Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                        },
                        error: () => {
                            patchState(store, { message: 'echoué' });
                            Showsnackerbaralert('échoué', 'fail', snackbar)
                        }
                    }
                    ))
                }))),
            removeDate: rxMethod<string>(pipe(
                switchMap((date) => {
                    let obs: Observable<any>[] = []
                    for (let row of store.personnel_data()) {
                        if (row.dates.includes(date))
                            obs.push(task_service.removePerson(row, date))
                    }
                    return concat(obs)
                }
                ))),
            updatePersonnel: rxMethod<tab_personnel>(pipe(
                switchMap((personnel) => {
                    return task_service.updateModel(store.path_string(), personnel).pipe(
                        tap({
                            next: () => {
                                var data = store.personnel_data()
                                var index = data.findIndex(x => x.id == personnel.id)
                                data[index] = personnel
                                patchState(store, { personnel_data: data })
                                Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            },
                            error: () => {
                                patchState(store, { message: 'echoué' });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            ModifPersonnel: rxMethod<any>(pipe(
                switchMap((person) => {
                    return task_service.ModifPerson(person).pipe(
                        tap({
                            next: () => {
                                var data = store.personnel_data()
                                var index = data.findIndex(x => x.id == person.id)
                                data[index] = person
                                patchState(store, { personnel_data: data })
                                //Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            },
                            error: () => {
                                //patchState(store, { message: 'echoué' });
                                //Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            ModifMultiPersonnel: rxMethod<boolean>(pipe(
                switchMap((completed) => {
                    let filtre = store.personnel_data().filter(x => x.dates.includes(store.current_date()))
                    let obs: Observable<any>[] = []
                    for (let row of filtre) {
                        let data = row
                        let index = data.dates.indexOf(store.current_date(), 0)
                        let presence = data.presence
                        presence[index] = completed
                        data.presence = presence
                        let heurenorm = data.heuresN
                        let heuresup = data.heureSup
                        if (!completed) {
                            heurenorm[index] = 0
                            heuresup[index] = 0
                            data.heuresN = heurenorm
                            data.heureSup = heuresup
                        }
                        else {
                            heurenorm[index] = 8
                            heuresup[index] = 0
                            data.heuresN = heurenorm
                            data.heureSup = heuresup
                        }

                        obs.push(task_service.ModifPerson(data))
                    }

                    return concat(obs)
                })
            )),
            initialPersonnel: rxMethod<any>(pipe(
                switchMap((donnees) => {
                    let obs: Observable<any>[] = []
                    let date = store.current_date()
                    for (let row of donnees) {
                        obs.push(task_service.updatePerson(row, date));
                    }
                    return concat(obs)
                })
            )),

            reducePerson: rxMethod<any>(pipe(
                switchMap((personnel) => {
                    let date = store.current_date()
                    return task_service.removePerson(personnel, date)
                })
            )),

            initialAll: rxMethod<any>(pipe(
                switchMap((gasoil) => {
                    return task_service.updatePersonInit(gasoil)
                })
            )),
        }
    ))
)
export const GasoilStore = signalStore(
    { providedIn: 'root' },
    withState(initialGasoilState),
    withComputed((store, engins_store = inject(EnginsStore)) => (
        {
            lastNum: computed(() => {
                return Math.max(...store.conso_data().map(x => Number(x.numero)))
            }),
            taille: computed(() => store.conso_data().length),
            quantite_go: computed(() => {
                let data = store.conso_data().map(x => x.quantite_go);
                return somme(data)
            }),
            conso_jour: computed(() => {
                let madate = store.selectedDate();
                if (madate[0] == '') {
                    return somme(store.conso_data().filter(x => {
                        return convertDate(x.date).setHours(0, 0, 0, 0) == convertDate(store.date_jour()).setHours(0, 0, 0, 0)
                    }).map(x => x.quantite_go));
                }
                else {
                    return somme(store.conso_data().filter(x => {
                        return convertDate(x.date).setHours(0, 0, 0, 0) == convertDate(madate[0]).setHours(0, 0, 0, 0)
                    }).map(x => x.quantite_go));
                }
            }
            ),
            date_du_jour: computed(() => {
                return store.date_jour()
            }),
            conso_intervalle: computed(() => {
                let madate = store.selectedDate();
                return somme(store.conso_data().filter(x => {
                    return convertDate(x.date).setHours(0, 0, 0, 0) >= convertDate(madate[0]).setHours(0, 0, 0, 0) &&
                        convertDate(x.date).setHours(0, 0, 0, 0) <= convertDate(madate[1]).setHours(0, 0, 0, 0)
                }).map(x => x.quantite_go)
                )
            }),
            datasource: computed(() => {

                let enginId = store.selectedEngin();
                let classId = store.selectedClass();
                let engin_data = engins_store.engins();
                let myengins = classId != '' ? engin_data
                    .filter(x => x.classe_id === classId) : engin_data;
                let enginsClass = myengins.map(x => x.id);
                let myconso1 = store.conso_data().filter(x => enginsClass.includes(x.engin_id));
                let myconso2 = enginId != '' ? myconso1.
                    filter(x => x.engin_id === enginId) : myconso1;
                var madate = store.selectedDate();
                let donnees_gasoil: Gasoil[];
                if (madate[0] === '') {
                    donnees_gasoil = myconso2;
                }
                else {
                    if (madate.length === 1) {
                        donnees_gasoil = classeTabBynumero(
                            myconso2.filter(x => x.date === madate[0]))
                    }
                    else {
                        let filtre = myconso2.
                            filter(x => {
                                return convertDate(x.date).setHours(0, 0, 0, 0) >= convertDate(madate[0]).setHours(0, 0, 0, 0) &&
                                    convertDate(x.date).setHours(0, 0, 0, 0) <= convertDate(madate[1]).setHours(0, 0, 0, 0)
                            })
                        donnees_gasoil = filtre;
                    }
                }
                let donnees: any = [];
                donnees_gasoil.forEach(element => {
                    let engin = engin_data.find(x => x.id == element.engin_id);
                    donnees.push(
                        {
                            'id': element.id,
                            'situation_cp': 'ok',
                            'designation': engin?.designation,
                            'engin_id': element.engin_id,
                            'classe_id': engin?.classe_id,
                            'code_parc': engin?.code_parc,
                            'compteur': element.compteur,
                            'quantite_go': element.quantite_go,
                            'date': element.date,
                            'numero': element.numero,
                            'diff_work': element.diff_work
                        }
                    )
                })
                return classeTabDate(donnees).sort((a: any, b: any) =>
                    b.numero - a.numero
                );
            }),
            historique_consogo: computed(() => {
                let unique_dates = classement(store.conso_data().map(x => x.date).filter((value, index, self) => self.indexOf(value) === index))
                let conso: any = [];
                for (let i = 0; i <= 9; i++) {
                    let row = unique_dates[i];
                    let filtres = store.conso_data().filter(x => x.date === row);
                    if (row) {
                        let som = somme(filtres.map(x => x.quantite_go));
                        conso = [...conso, {
                            x: convertDate(row),
                            y: som
                        }]
                    }
                }
                //console.log(conso)
                return [conso, unique_dates]
            }
            )
        })),
    withMethods(
        (
            store,
            task_service = inject(TaskService),
            snackbar = inject(MatSnackBar),
            comptes = inject(CompteStore)) => ({
                setPathString(path: string) {
                    patchState(store, { path_string: path })
                },
                filtrebyDate(date: string[]) {
                    patchState(store, { selectedDate: date })
                }
                ,
                setCurrentDate(date: string) {
                    patchState(store, { date_jour: date })
                },
                filterByEnginId(enginId: string) {
                    patchState(store, { selectedEngin: enginId })
                },
                filterByClassId(classId: string) {
                    patchState(store, { selectedClass: classId })

                }
                ,
                load_compte_conso() {
                    patchState(store, { conso_data: comptes.conso_go() })
                },
                loadconso: rxMethod<void>(pipe(
                    switchMap(
                        () => {
                            return task_service.getallModels(store.path_string(),).pipe(
                                tap(
                                    data => {
                                        patchState(store, { conso_data: data })
                                    }
                                )
                            )
                        }
                    )
                )
                )
                ,
                addconso: rxMethod<any>(pipe(
                    switchMap((gasoil) => {
                        return task_service.addModel(store.path_string(), gasoil).pipe(
                            tap({
                                next: () => {
                                    Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                                },
                                error: () => {
                                    patchState(store, { message: 'echoué' });
                                    Showsnackerbaralert('échoué', 'fail', snackbar)
                                }
                            }
                            )
                        )
                    })
                )),
                removeconso: rxMethod<string>(pipe(
                    switchMap((id) => {
                        return task_service.deleteModel(store.path_string(), id).pipe(tap(
                            {
                                next: () => {

                                    Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                                },
                                error: () => {
                                    patchState(store, { message: 'echoué' });
                                    Showsnackerbaralert('échoué', 'fail', snackbar)
                                }
                            }

                        ))
                    }))),
                updateconso: rxMethod<any>(pipe(
                    switchMap((gasoil) => {
                        return task_service.updateModel(store.path_string(), gasoil).pipe(
                            tap({
                                next: () => {
                                    Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                                },
                                error: () => {
                                    patchState(store, { message: 'echoué' });
                                    Showsnackerbaralert('échoué', 'fail', snackbar)
                                }
                            }
                            )
                        )
                    })
                ))
            }
        ))
)
export const ApproGasoilStore = signalStore(
    { providedIn: 'root' },
    withState(initialApprogoState),
    withComputed((store) => (
        {
            taille: computed(() => store.approgo_data().length),
            quantite_go: computed(() => {
                var data = store.approgo_data().map(x => x.quantite)
                return somme(data)
            }),
            datasource: computed(() => { return classeTabDate(store.approgo_data()) })
        }
    )
    ),
    withMethods((store,
        monservice = inject(WenService),
        task_service = inject(TaskService),
        compte = inject(CompteStore),
        snackbar = inject(MatSnackBar)) =>
    (
        {
            setPathString(path: string) {
                patchState(store, { path_string: path })
            },
            filtrebyDate(date: string) {
                var data = store.approgo_data().filter(x => x.date == date)
                patchState(store, { approgo_data: classeTabDate(data) })
            }
            ,
            load_compte_appro() {
                patchState(store, { approgo_data: compte.appro_go() })
            },

            loadappro: rxMethod<void>(pipe(switchMap(() => {
                return task_service.getAllApproGo().pipe(
                    tap(data => {
                        patchState(store, { approgo_data: classeTabDate(data) })
                    })
                )
            }
            ))),
            addappro: rxMethod<appro_gasoil>(pipe(
                switchMap((appro) => {
                    return task_service.addApproGo(appro).pipe(
                        tap({
                            next: () => {
                                const updatedonnes = [...store.approgo_data(), appro]
                                patchState(store, { approgo_data: updatedonnes })
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            removeappro: rxMethod<string>(pipe(
                switchMap((id) => {
                    return task_service.deleteApproGo(id).pipe(tap({
                        next: () => {
                            const updatedonnes = store.approgo_data().filter(x => x.id != id)
                            patchState(store, { approgo_data: updatedonnes })
                            Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                        }, error: () => {
                            Showsnackerbaralert('échoué', 'fail', snackbar)
                        }
                    }

                    ))
                }))),
            updateappro: rxMethod<appro_gasoil>(pipe(
                switchMap((appro) => {
                    return task_service.updateApproGo(appro).pipe(
                        tap({
                            next: () => {
                                var data = store.approgo_data()
                                var index = data.findIndex(x => x.id == appro.id)
                                data[index] = appro
                                patchState(store, { approgo_data: data })
                                Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),

        }
    ))
)
export const PannesStore = signalStore(
    { providedIn: 'root' },
    withState(initialPannesState),
    withComputed((store, enginstore = inject(EnginsStore)) => (
        {
            taille: computed(() => store.pannes_data().length),

            donnees_pannes: computed(() => {
                var intervale = store.intervalleDate()
                var engins_ids = store.EnginsIds()
                if (intervale[0] == '') {
                    if (engins_ids[0] == '') {
                        return store.pannes_data()
                    }
                    else {
                        let filtre = store.pannes_data().filter(x => {
                            return engins_ids.includes(x.engin_id)
                        })
                        return filtre
                    }
                }
                else {
                    let data: Pannes[]
                    if (intervale.length == 1) {
                        data = store.pannes_data().filter(
                            x => {
                                if (x.situation == 'depanne') {
                                    return (convertDate(x.debut_panne).setHours(0, 0, 0, 0) == convertDate(intervale[0]).setHours(0, 0, 0, 0))
                                }
                                else {
                                    let rep = convertDate(x.debut_panne) <= convertDate(intervale[0])
                                    return rep
                                }
                            })
                    }
                    else {
                        data = store.pannes_data().filter(
                            x => {
                                let endDate = x.situation == 'garage' ? new Date((new Date()).setHours(0, 0, 0, 0)) : new Date(convertDate(x.fin_panne).setHours(0, 0, 0, 0))
                                if (x.situation == 'depanne') {
                                    let rep = (convertDate(x.debut_panne) >= convertDate(intervale[0]) && convertDate(x.debut_panne) <= convertDate(intervale[1])) ||
                                        (endDate <= new Date(convertDate(intervale[1]).setHours(0, 0, 0, 0)) && endDate >= new Date(convertDate(intervale[0]).setHours(0, 0, 0, 0)))
                                    return rep
                                }
                                else {
                                    let rep = convertDate(x.debut_panne) <= convertDate(intervale[1])
                                    return rep
                                }
                            })
                    }


                    if (engins_ids[0] == '') {
                        return data
                    }
                    else {
                        let filtre = data.filter(x => {
                            return engins_ids.includes(x.engin_id)
                        })
                        return filtre
                    }
                }
            }),
            donnees_PannesById: computed(() => {
                var ind = store.selectedId();
                let data: Pannes[] = store.pannes_data().filter(x => x.engin_id == ind);
                return data
            }),
            donnees_PannesByEnginsIds: computed(() => {
                var engins_id = enginstore.donnees_engins()
                var ind = engins_id.map(x => x.id)
                let data: Pannes[] = store.pannes_data().filter(x => ind.includes(x.engin_id))
                return data
            })
        }
    )
    ),
    withMethods((store,
        monservice = inject(WenService),
        task_service = inject(TaskService),
        compte = inject(CompteStore),
        snackbar = inject(MatSnackBar)) =>
    (
        {
            setPathString(path: string) {
                patchState(store, { path_string: path })
            },

            filtrebyId(id: string) {
                patchState(store, { selectedId: id })
            },
            setIntervalleDate(intervale: string[]) {
                patchState(store, { intervalleDate: intervale })
            },
            setEnginsIds(Ids: string[]) {
                patchState(store, { EnginsIds: Ids })
            },
            load_compte_pannes() {
                patchState(store, { pannes_data: compte.pannes() })
            },
            loadPannes: rxMethod<void>(pipe(switchMap(() => {
                return task_service.getallModels(store.path_string()).pipe(
                    tap((data) => {
                        patchState(store, { pannes_data: classeTabDatePanne(data) })
                    })
                )
            }
            ))),
            addPannes: rxMethod<any>(pipe(
                switchMap((panne) => {
                    return task_service.addModel(store.path_string(), panne).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            }, error: () => { Showsnackerbaralert('échoué', 'fail', snackbar) }
                        }
                        )
                    )
                })
            )),
            removePannes: rxMethod<string>(pipe(
                switchMap((id) => {
                    return task_service.deleteModel(store.path_string(), id).pipe(tap({
                        next: () => {
                            Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                        }, error: () => {
                            Showsnackerbaralert('échoué', 'fail', snackbar)
                        }
                    }
                    ))
                }))),
            updatePannes: rxMethod<any>(pipe(
                switchMap((panne) => {
                    return task_service.updateModel(store.path_string(), panne).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('modifié avec succès', 'pass', snackbar)
                            },
                            error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),

        }
    ))
)
export const ContratStore = signalStore(
    { providedIn: 'root' },
    withState(initialContratStore),
    withComputed((store, enginstore = inject(EnginsStore)) => (
        {
            taille: computed(() => store.contrats_data().length),
            donnees_contrat: computed(() => store.contrats_data()),
            donnees_ContratById: computed(() => {
                var ind = store.selectedId
                let data: Contrats[] = store.contrats_data().filter(x => x.id == ind())
                return data
            })
        }
    )
    ),
    withMethods((store, monservice = inject(WenService), snackbar = inject(MatSnackBar)) =>
    (
        {

            filtrebyId(id: string) {
                patchState(store, { selectedId: id })
            },

            loadContrat: rxMethod<void>(pipe(switchMap(() => {
                return monservice.getallContrat().pipe(
                    tap((data) => {
                        patchState(store, { contrats_data: data })
                    })
                )
            }
            ))),
            addContrat: rxMethod<Contrats>(pipe(
                switchMap((contrat) => {
                    return monservice.addContrat(contrat).pipe(
                        tap({
                            next: () => {
                                const updatedonnes = [...store.contrats_data(), contrat]
                                patchState(store, { contrats_data: updatedonnes })
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            }, error: () => { Showsnackerbaralert('échoué', 'fail', snackbar) }
                        }
                        )
                    )
                })
            )),
            removeContrat: rxMethod<string>(pipe(
                switchMap((id) => {
                    return monservice.deletePanne(id).pipe(tap({
                        next: () => {
                            const updatedonnes = store.contrats_data().filter(x => x.id != id)
                            patchState(store, { contrats_data: updatedonnes })
                            Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                        }, error: () => {
                            Showsnackerbaralert('échoué', 'fail', snackbar)
                        }
                    }

                    ))
                }))),
            updateContrat: rxMethod<Contrats>(pipe(
                switchMap((contrat) => {
                    return monservice.updateContrat(contrat).pipe(
                        tap({
                            next: () => {
                                var data = store.contrats_data()
                                var index = data.findIndex(x => x.id == contrat.id)
                                data[index] = contrat
                                patchState(store, { contrats_data: data })
                                Showsnackerbaralert('modifié avec succès', 'pass', snackbar)
                            },
                            error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),

        }
    ))
)
export const PointageStore = signalStore(
    { providedIn: 'root' },
    withState(initialPointageStore),
    withComputed((store) => (
        {
            taille: computed(() => store.pointage_data().length),
            donnees_pointage: computed(() => store.pointage_data()),
            donnees_ContratById: computed(() => {
                var ind = store.selectedId
                let data: pointage[] = store.pointage_data().filter(x => x.id == ind())
                return data
            })
        }
    )
    ),
    withMethods((store, monservice = inject(WenService), snackbar = inject(MatSnackBar)) =>
    (
        {

            filtrebyId(id: string) {
                patchState(store, { selectedId: id })
            },

            loadpointage: rxMethod<void>(pipe(switchMap(() => {
                return monservice.getallpointage().pipe(
                    tap((data) => {
                        patchState(store, { pointage_data: data })
                    })
                )
            }
            ))),
            addpointage: rxMethod<pointage>(pipe(
                switchMap((pointage) => {
                    return monservice.addpointage(pointage).pipe(
                        tap({
                            next: () => {
                                const updatedonnes = [...store.pointage_data(), pointage]
                                patchState(store, { pointage_data: updatedonnes })
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            }, error: () => { Showsnackerbaralert('échoué', 'fail', snackbar) }
                        }
                        )
                    )
                })
            )),
            removepointage: rxMethod<string>(pipe(
                switchMap((id) => {
                    return monservice.deletepointage(id).pipe(tap({
                        next: () => {
                            const updatedonnes = store.pointage_data().filter(x => x.id != id)
                            patchState(store, { pointage_data: updatedonnes })
                            Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                        }, error: () => {
                            Showsnackerbaralert('échoué', 'fail', snackbar)
                        }
                    }

                    ))
                }))),
            updatepointage: rxMethod<pointage>(pipe(
                switchMap((pointage) => {
                    return monservice.updatepointage(pointage).pipe(
                        tap({
                            next: () => {
                                var data = store.pointage_data()
                                var index = data.findIndex(x => x.id == pointage.id)
                                data[index] = pointage
                                patchState(store, { pointage_data: data })
                                Showsnackerbaralert('modifié avec succès', 'pass', snackbar)
                            },
                            error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),

        }
    ))
)
export const NatureTrvxStore = signalStore(
    { providedIn: 'root' },
    withState(initialNatureTrvxStore),
    withComputed((store) => (
        {
            taille: computed(() => store.nature_tvx_data().length.toString()),
            designation: computed(() => {
                let filtre = store.nature_tvx_data().filter(x => store.selectedIds().includes(x.id))
                return filtre.map(x => x.designation)
            }),
            donnees_naturetrvx: computed(() => store.nature_tvx_data()),
            donnees_naturetrvxById: computed(() => {
                var ind = store.selectedId
                let data: nature_travaux[] = store.nature_tvx_data().filter(x => x.id == ind())
                return data
            })
        }
    )
    ),
    withMethods((store, monservice = inject(WenService), snackbar = inject(MatSnackBar)) =>
    (
        {


            filtrebyId(id: string) {
                patchState(store, { selectedId: id })
            },
            filtrebyIds(ids: string[]) {
                patchState(store, { selectedIds: ids })
            },
            loadnaturetrvx: rxMethod<void>(pipe(switchMap(() => {
                return monservice.getallnaturetrvx().pipe(
                    tap((data) => {
                        patchState(store, { nature_tvx_data: data })
                    })
                )
            }
            ))),
            addnaturetrvx: rxMethod<nature_travaux>(pipe(
                switchMap((naturetrvx) => {
                    return monservice.addnaturetrvx(naturetrvx).pipe(
                        tap({
                            next: () => {
                                const updatedonnes = [...store.nature_tvx_data(), naturetrvx]
                                patchState(store, { nature_tvx_data: updatedonnes })
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            }, error: () => { Showsnackerbaralert('échoué', 'fail', snackbar) }
                        }
                        )
                    )
                })
            )),
            removenaturetrvx: rxMethod<string>(pipe(
                switchMap((id) => {
                    return monservice.deletenaturetrvx(id).pipe(tap({
                        next: () => {
                            const updatedonnes = store.nature_tvx_data().filter(x => x.id != id)
                            patchState(store, { nature_tvx_data: updatedonnes })
                            Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                        }, error: () => {
                            Showsnackerbaralert('échoué', 'fail', snackbar)
                        }
                    }

                    ))
                }))),
            updatenaturetrvx: rxMethod<nature_travaux>(pipe(
                switchMap((naturetrvx) => {
                    return monservice.updatenaturetrvx(naturetrvx).pipe(
                        tap({
                            next: () => {
                                var data = store.nature_tvx_data()
                                var index = data.findIndex(x => x.id == naturetrvx.id)
                                data[index] = naturetrvx
                                patchState(store, { nature_tvx_data: data })
                                Showsnackerbaralert('modifié avec succès', 'pass', snackbar)
                            },
                            error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),

        }
    ))
)
export const TravauxStore = signalStore(
    { providedIn: 'root' },
    withState(initialTravauxStore),
    withComputed((store, go_store = inject(GasoilStore), engins_store = inject(EnginsStore)) => (
        {
            taille: computed(() => {
                return store.travaux_data().length
            }),
            donnees_travaux: computed(() => {
                if (store.selectedDate() == '') {
                    return store.travaux_data()
                }
                else {
                    return store.travaux_data().filter(x => x.date == store.selectedDate())
                }
            }),
            donnees_travauxById: computed(() => {
                var ind = store.selectedId
                let data: travaux[] = store.travaux_data().filter(x => x.id == ind())
                return data
            }),
            historique_appro: computed(() => {
                let unique_dates = classement(store.travaux_data().map(x => x.date).filter((value, index, self) => self.indexOf(value) === index))
                let appro: any = []
                let i = 0
                for (let i = 0; i <= 9; i++) {
                    let row = unique_dates[i]
                    var filtres = store.travaux_data().filter(x => x.date == row)
                    let som = 0
                    if (row) {
                        for (let row2 of filtres) {
                            som = som + Number(row2.quantite)
                        }

                        appro = [...appro, {
                            x: convertDate(row),
                            y: som
                        }]
                    }
                }
                return appro
            }
            ),
            historique_conso: computed(() => {
                let unique_dates = classement(store.travaux_data().map(x => x.date).filter((value, index, self) => self.indexOf(value) === index))
                let qte: any = []
                let i = 0
                let engins = engins_store.donnees_engins().filter(x => x.classe_id == 'E8XQLrBOG1oXBTelHa8y'
                    || x.classe_id == '42TDHnqUNEu5WZKaiKzt'
                    || x.classe_id == 'oe39MfblrBDc9ny2yEvS')
                for (let i = 0; i <= 9; i++) {
                    let row = unique_dates[i]
                    let filtres = go_store.conso_data().filter(x => x.date == row && engins.map(x => x.id).includes(x.engin_id))
                    if (row)
                        if (filtres.length > 0) {
                            let som = somme(filtres.map(x => x.quantite_go))

                            qte = [...qte, {
                                x: convertDate(row),
                                y: som
                            }]
                        }
                        else {
                            qte = [...qte, {
                                x: convertDate(row),
                                y: 0
                            }]
                        }
                }
                return qte
            })
        }
    )
    ),
    withMethods((store, monservice = inject(WenService), snackbar = inject(MatSnackBar)) =>
    (
        {

            filtrebyId(id: string) {
                patchState(store, { selectedId: id })
            },
            filterbyDate(date: string) {
                patchState(store, { selectedDate: date })
            },
            loadtravaux: rxMethod<void>(pipe(switchMap(() => {
                return monservice.getalltravaux().pipe(
                    tap((data) => {
                        patchState(store, { travaux_data: data })
                    })
                )
            }
            ))),
            addtravaux: rxMethod<travaux>(pipe(
                switchMap((travaux) => {
                    return monservice.addtravaux(travaux).pipe(
                        tap({
                            next: () => {
                                const updatedonnes = [...store.travaux_data(), travaux]
                                //patchState(store, { travaux_data: updatedonnes })
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            }, error: () => { Showsnackerbaralert('échoué', 'fail', snackbar) }
                        }
                        )
                    )
                })
            )),
            removetravaux: rxMethod<string>(pipe(
                switchMap((id) => {
                    return monservice.deletetravaux(id).pipe(tap({
                        next: () => {
                            const updatedonnes = store.travaux_data().filter(x => x.id != id)
                            patchState(store, { travaux_data: updatedonnes })
                            Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                        }, error: () => {
                            Showsnackerbaralert('échoué', 'fail', snackbar)
                        }
                    }

                    ))
                }))),
            updatetravaux: rxMethod<travaux>(pipe(
                switchMap((travaux) => {
                    return monservice.updatetravaux(travaux).pipe(
                        tap({
                            next: () => {
                                var data = store.travaux_data()
                                var index = data.findIndex(x => x.id == travaux.id)
                                data[index] = travaux
                                patchState(store, { travaux_data: data })
                                Showsnackerbaralert('modifié avec succès', 'pass', snackbar)
                            },
                            error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),

        }
    ))
)
export const StatutStore = signalStore(
    { providedIn: 'root' },
    withState(initialStatutState),
    withComputed((store) => (
        {
            taille: computed(() => {
                return store.statut_data().length
            }),
            donnees_statut: computed(() => {
                return store.statut_data()
            })

        }
    )),
    withMethods((store, _task_service = inject(TaskService), snackbar = inject(MatSnackBar)) =>
    (
        {
            setPathString(path: string) {
                patchState(store, { path_string: path })
            },
            loadstatut: rxMethod<void>(pipe(switchMap(() => {
                return _task_service.getallModels(store.path_string()).pipe(
                    tap({
                        next: (statut) => {
                            patchState(store, { statut_data: statut })
                        },
                        error: () => {
                            Showsnackerbaralert('impossible de charger les données', 'fail', snackbar)
                        }
                    }))
            })))
        }
    ))

)
///**************** */
export const DevisStore = signalStore(
    { providedIn: 'root' },
    withState(initialDevisState),
    withComputed((store) => (
        {
            taille: computed(() => {
                return store.devis_data().length
            }),
            donnees_devis: computed(() => {
                let projet_id = store.selectedProjet_id()
                let entrep_id = store.selectedEntreprise_id()
                if (projet_id == "") {

                    if (entrep_id == "") {
                        return store.devis_data()
                    }
                    else {
                        return store.devis_data().filter(x => x.entreprise_id == entrep_id)
                    }

                }
                else {
                    let data = store.devis_data().filter(x => x.projet_id == projet_id)
                    if (entrep_id == "") {
                        return data
                    }
                    else {
                        return data.filter(x => x.entreprise_id == entrep_id)
                    }
                }
            }),
            donnees_currentDevis: computed(() => {
                let id = store.current_devis_id()
                return store.devis_data().find(x => x.id == id)
            }),
            devisIds: computed(() => {
                return store.devis_data().map(x => x.id)
            }
            ),


        }
    )),
    withMethods((store,
        _task_service = inject(TaskService),
        _sous_traitance_store=inject(SstraitantStore),
        snackbar = inject(MatSnackBar)) =>
    (

        {
            setCurrentDevisId(id: string) {
                patchState(store, { current_devis_id: id })
            },
            setCurrentDevis(devis: Devis | undefined) {
                patchState(store, { current_devis: devis })
            },
            setPathString(path: string) {
                patchState(store, { path_string: path })
            },
            filtrebyProjet(projet_id: string) {
                patchState(store, { selectedProjet_id: projet_id })
            },
            filtrebyEntreprise(entreprise_id: string) {
                patchState(store, { selectedEntreprise_id: entreprise_id })
            },
            loadDevis: rxMethod<void>(pipe(switchMap(() => {
                return _task_service.getallModels(store.path_string()).pipe(
                    tap({
                        next: (statut) => {
                            patchState(store, { devis_data: statut })
                        },
                        error: () => {
                            Showsnackerbaralert('impossible de charger les données', 'fail', snackbar)
                        }
                    }))
            })))
            ,
            addDevis: rxMethod<Devis>(pipe(
                switchMap((devis) => {
                    return _task_service.addModel(store.path_string(), devis).pipe(switchMap(
                        resp => {
                            let entreprise=_sous_traitance_store.donnees_sstraitant().find(x=>x.id==devis.entreprise_id)
                            return _task_service.initialDevis(store.path_string(), devis,entreprise?.enseigne?entreprise.enseigne:'')
                        }
                    ))

                })
            )),
            addDataDevis: rxMethod<any>(pipe(
                switchMap((row) => {
                    return _task_service.addDataDevis(store.path_string(), store.current_devis_id(),row).pipe(tap({
                        next:()=>
                        {},
                        error:()=>Showsnackerbaralert('échoué', 'fail', snackbar)
                    }))

                })
            )),
            removeDevis: rxMethod<string>(pipe(
                switchMap((id) => {
                    return _task_service.deleteModel(store.path_string(), id).pipe(tap({
                        next: () => {
                            Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                        }, error: () => {
                            Showsnackerbaralert('échoué', 'fail', snackbar)
                        }
                    }

                    ))
                }))),
            updateDevis: rxMethod<Devis>(pipe(
                switchMap((devis) => {
                    return _task_service.updateModel(store.path_string(), devis).pipe(
                        tap({
                            next: () => {
                                patchState(store, { current_devis: devis });
                                patchState(store, { current_devis_id: devis.id });
                                Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            ))
        }
    ))
)
export const LigneDevisStore = signalStore(
    { providedIn: 'root' },
    withState(initialLigneDevisState),
    withComputed((store, _service = inject(WenService)) => (
        {
            taille: computed(() => {
                return store.lignedevis_data().length
            }),
            donnees_Lignedevis: computed(() => {
                let devis_id = store.selectedDevis_id()
                return store.lignedevis_data().filter(x => x.devis_id == devis_id)
            }),
            taches_classees: computed(() => {
                let devis_id = store.selectedDevis_id()
                let lignes_devis = store.lignedevis_data().filter(x => x.devis_id == devis_id);
                let mydata: Ligne_devis[] = []
                let code_parent = lignes_devis.filter(x => x.parent_code == "").map(x => x.code);
                let donnees0 = _service.classement_Ldevis(lignes_devis.filter(x => code_parent.includes(x.code)))

                donnees0.forEach(element => {
                    mydata.push(element)
                    let donnees1 = _service.classement_Ldevis(lignes_devis.filter(x => x.parent_code == element.code))
                    donnees1.forEach(element => {
                        mydata.push(element)
                        let donnees3 = _service.classement_Ldevis(lignes_devis.filter(x => x.parent_code == element.code))
                        donnees3.forEach(element => {
                            mydata.push(element)
                        });
                    });
                });
                return mydata
            }),
            montantDevis: computed(() => {
                let devis_id = store.selectedDevis_id()
                let lignes_devis = store.lignedevis_data().filter(x => x.devis_id == devis_id);

                let mydata: Ligne_devis[] = []
                let code_parent = lignes_devis.filter(x => x.parent_code == "").map(x => x.code);
                let donnees0 = _service.classement_Ldevis(lignes_devis.filter(x => code_parent.includes(x.code)))

                donnees0.forEach(element => {
                    mydata.push(element)
                    let donnees1 = _service.classement_Ldevis(lignes_devis.filter(x => x.parent_code == element.code))
                    donnees1.forEach(element => {
                        mydata.push(element)
                        let donnees3 = _service.classement_Ldevis(lignes_devis.filter(x => x.parent_code == element.code))
                        donnees3.forEach(element => {
                            mydata.push(element)
                        });
                    });
                });

                let init = mydata.map(x => x.parent_code).filter(x => x != '')
                let codes: any = []
                mydata.forEach(element => {
                    let montant = 0
                    if (!init.includes(element.code)) {
                        montant = element.quantite * element.prix_u
                        codes.push(element.parent_code)
                    }
                    element.montant = montant

                })
                let codes2: any = []
                mydata.forEach((element: any) => {
                    if (codes.includes(element.code)) {
                        let filtres = mydata.filter(x => x.parent_code == element.code).map(x => x.montant)
                        element.montant = _service.somme(filtres)
                        codes2.push(element.parent_code)
                    }
                });
                let codes3: any = []
                mydata.forEach((element: any) => {
                    if (codes2.includes(element.code)) {
                        let filtres = mydata.filter(x => x.parent_code == element.code).map(x => x.montant)
                        element.montant = _service.somme(filtres)
                        codes3.push(element.parent_code)
                    }
                });
                let ligne_parent0 = lignes_devis.filter(x => x.parent_code == "").map(x => x.code);
                let data = mydata.filter(x => ligne_parent0.includes(x.code)).map(x => x.montant);
                return _service.somme(data);
            })
        }
    )),
    withMethods((
        store,
        monservice = inject(WenService),
        _task_service = inject(TaskService),
        snackbar = inject(MatSnackBar)
    ) =>
    (
        {
            setPathString(path: string) {
                patchState(store, { path_string: path })
            },
            filtrebyDevis(devis_id: string) {
                patchState(store, { selectedDevis_id: devis_id })
            },
            loadLigneDevis: rxMethod<void>(pipe(switchMap(() => {
                return _task_service.getallModels(store.path_string()).pipe(
                    tap({
                        next: (ldevis) => {
                            let ids = ldevis.filter(x => x.parent_code != "").map(x => x.id)
                            for (let ind in ldevis) {
                                ldevis[ind].isvisible = true
                                ldevis[ind].collapsed = true
                                ldevis[ind].montant = 0
                            }
                            patchState(store, { lignedevis_data: classement_Ldevis(ldevis) })
                        },
                        error: () => {
                            Showsnackerbaralert('impossible de charger les données', 'fail', snackbar)
                        }
                    }))
            })))
            ,
            addLigneDevis: rxMethod<any>(pipe(
                switchMap((ldevis) => {
                    return _task_service.addModel(store.path_string(), ldevis).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            removeLigneDevis: rxMethod<string>(pipe(
                switchMap((id) => {
                    return _task_service.deleteModel(store.path_string(), id).pipe(tap({
                        next: () => {
                            const updatedonnes = store.lignedevis_data().filter(x => x.id != id)
                            patchState(store, { lignedevis_data: updatedonnes })
                            Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                        }, error: () => {
                            Showsnackerbaralert('échoué', 'fail', snackbar)
                        }
                    }

                    ))
                }))),
            removeLigneManyDevis: rxMethod<string[]>(pipe(
                switchMap((ids) => {
                    let obs: Observable<any>[] = []
                    ids.forEach(element => {
                        obs.push(_task_service.deleteModel(store.path_string(), element))
                    });
                    return concat(obs)
                }))),
            updateLigneDevis: rxMethod<any>(pipe(
                switchMap((ldevis) => {
                    return _task_service.updateModel(store.path_string(), ldevis).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            ))
        }
    ))


)
export const ConstatStore = signalStore(
    { providedIn: 'root' },
    withState(initialConstatState),
    withComputed((store, _service = inject(WenService), devis = inject(LigneDevisStore)) => (
        {
            taille: computed(() => {
                return store.constat_data().length
            }),
            constats_by_poste: computed(() => {
                let poste_id = store.selected_poste_id()
                return store.constat_data().filter(x => x.poste_id == poste_id)
            })
            ,
            constats_by_devis: computed(() => {

                let devis_id = devis.selectedDevis_id();
                let postes = devis.lignedevis_data().filter(x => x.devis_id == devis_id).map(x => x.id);
                return store.constat_data().filter(x => postes.includes(x.poste_id))
            }),
            last_num: computed(() => {
                let devis_id = devis.selectedDevis_id();
                let postes = devis.lignedevis_data().filter(x => x.devis_id == devis_id).map(x => x.id)
                let constats = store.constat_data().filter(x => postes.includes(x.poste_id));
                let numeros = constats.map(x => x.numero)
                let last_num = 0
                if (numeros.length > 0) {
                    last_num = Math.max(...numeros)
                }
                return last_num
            }),

            min_numero: computed(() => {
                let devis_id = devis.selectedDevis_id();

                let postes = devis.lignedevis_data().filter(x => x.devis_id == devis_id).map(x => x.id)
                let constats = store.constat_data().filter(x => postes.includes(x.poste_id));
                let numeros = constats.map(x => x.numero)
                let min_num = 0
                if (numeros.length > 0) {
                    min_num = Math.min(...numeros)
                }
                return min_num
            }),
            attachements: computed(() => {
                let taches = devis.taches_classees();
                let numero_attach = store.selected_dp()
                let codes_parent = devis.donnees_Lignedevis().map(x => x.parent_code).filter(x => x != '');

                let postes = devis.donnees_Lignedevis().map(x => x.id)
                let constats_by_devis = store.constat_data().filter(x => postes.includes(x.poste_id))

                let donnees_attach: any[] = [];
                taches.forEach(element => {
                    let poste_id = element.id;
                    let qtite_periode = 0;
                    let qtite_prec = 0;
                    let qtite_cumul = 0;
                    if (!codes_parent.includes(element.code)) {
                        let constats = constats_by_devis.filter(x => x.poste_id == poste_id && x.numero == numero_attach);
                        if (constats.length > 0) {
                            qtite_periode = _service.somme(constats.map(x => x.quantite_mois));
                        }
                        let last_constats = constats_by_devis.filter(x => x.numero < numero_attach && x.poste_id == poste_id);
                        if (last_constats.length > 0) {
                            qtite_prec = _service.somme(last_constats.map(x => x.quantite_mois));
                        }
                        qtite_cumul = qtite_prec + qtite_periode;
                    }
                    donnees_attach.push({
                        'id': element.id,
                        'poste': element.poste,
                        'designation': element.designation,
                        'unite': element.unite,
                        'prix_u': element.prix_u,
                        'quantite_marche': element.quantite.toFixed(2),
                        'montant_marche': (element.quantite * element.prix_u).toFixed(2),
                        'quantite_prec': qtite_prec.toFixed(2),
                        'quantite_periode': qtite_periode.toFixed(2),
                        'quantite_cumul': qtite_cumul.toFixed(2),
                        'montant_prec': qtite_prec * element.prix_u,
                        'montant_periode': qtite_periode * element.prix_u,
                        'montant_cumul': qtite_cumul * element.prix_u,
                        'taux': element.quantite == 0 ? 0 : ((qtite_cumul / element.quantite) * 100).toFixed(2),
                        'code': element.code,
                        'parent_code': element.parent_code,
                        'numero': numero_attach
                    })
                });
                let init = donnees_attach.map(x => x.parent_code).filter(x => x != '')
                let codes: any = []
                donnees_attach.forEach(element => {
                    if (!init.includes(element.code)) {
                        codes.push(element.parent_code)
                    }

                })
                let codes2: any = []
                donnees_attach.forEach((element: any) => {
                    if (codes.includes(element.code)) {
                        let filtres_Mmarche = donnees_attach.filter(x => x.parent_code == element.code).map(x => x.montant_marche)
                        let filtres_Mprec = donnees_attach.filter(x => x.parent_code == element.code).map(x => x.montant_prec)
                        let filtres_Mperiode = donnees_attach.filter(x => x.parent_code == element.code).map(x => x.montant_periode)
                        let filtres_Mcumul = donnees_attach.filter(x => x.parent_code == element.code).map(x => x.montant_cumul)
                        element.montant_marche = _service.somme(filtres_Mmarche)
                        element.montant_prec = _service.somme(filtres_Mprec)
                        element.montant_periode = _service.somme(filtres_Mperiode)
                        element.montant_cumul = _service.somme(filtres_Mcumul)
                        if (_service.somme(filtres_Mmarche) == 0) {
                            element.taux = 0
                        }
                        else {
                            element.taux = (_service.somme(filtres_Mcumul) / _service.somme(filtres_Mmarche) * 100).toFixed(2)
                        }

                        codes2.push(element.parent_code)
                    }
                });
                let codes3: any = []
                donnees_attach.forEach((element: any) => {
                    if (codes2.includes(element.code)) {
                        let filtres_Mmarche = donnees_attach.filter(x => x.parent_code == element.code).map(x => x.montant_marche)
                        let filtres_Mprec = donnees_attach.filter(x => x.parent_code == element.code).map(x => x.montant_prec)
                        let filtres_Mperiode = donnees_attach.filter(x => x.parent_code == element.code).map(x => x.montant_periode)
                        let filtres_Mcumul = donnees_attach.filter(x => x.parent_code == element.code).map(x => x.montant_cumul)
                        element.montant_marche = _service.somme(filtres_Mmarche)
                        element.montant_prec = _service.somme(filtres_Mprec)
                        element.montant_periode = _service.somme(filtres_Mperiode)
                        element.montant_cumul = _service.somme(filtres_Mcumul)
                        if (_service.somme(filtres_Mmarche) == 0) {
                            element.taux = 0
                        }
                        else {
                            element.taux = (_service.somme(filtres_Mcumul) / _service.somme(filtres_Mmarche) * 100).toFixed(2)
                        }
                        codes3.push(element.parent_code)
                    }
                });
                return donnees_attach;
            }
            )
        }
    )),
    withMethods((store,
        _task_service = inject(TaskService),
        snackbar = inject(MatSnackBar)) =>
    (
        {
            setPathString(path: string) {
                patchState(store, { path_string: path })
            },
            filtrebyPosteId(poste_id: string) {
                patchState(store, { selected_poste_id: poste_id })
            },
            filtrebyDevisId(devis_id: string) {
                patchState(store, { selected_devis_id: devis_id })
            }
            ,
            filtrebyDpNumero(numero: number) {
                patchState(store, { selected_dp: numero })
            },
            loadConstats: rxMethod<void>(pipe(switchMap(() => {
                return _task_service.getallModels(store.path_string()).pipe(
                    tap({
                        next: (constats) => {
                            patchState(store, { constat_data: constats })
                        },
                        error: () => {
                            Showsnackerbaralert('impossible de charger les données', 'fail', snackbar)
                        }
                    }))
            }))),
            addConstat: rxMethod<any>(pipe(
                switchMap((constat) => {
                    return _task_service.addModel(store.path_string(), constat).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            removeConstat: rxMethod<string>(pipe(
                switchMap((id) => {
                    return _task_service.deleteModel(store.path_string(), id).pipe(tap({
                        next: () => {
                            Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                        }, error: () => {
                            Showsnackerbaralert('échoué', 'fail', snackbar)
                        }
                    }

                    ))
                }))),
            updateConstat: rxMethod<any>(pipe(
                switchMap((constat) => {
                    return _task_service.updateModel(store.path_string(), constat).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            RemoveManyConstat: rxMethod<Constats[]>(pipe(
                switchMap((donnees) => {
                    let obs: Observable<any>[] = []
                    for (let row of donnees) {
                        obs.push(_task_service.deleteModel(store.path_string(), row.id))
                    }
                    return concat(obs).pipe(tap({
                        next: () => {
                            const updatedonnes = store.constat_data().filter(x => !donnees.map(x => x.id).includes(x.id))
                            patchState(store, { constat_data: updatedonnes })

                        }, error: () => {

                        }
                    }))
                })
            )),
        }
    ))


)
export const AttachementStore = signalStore(
    { providedIn: 'root' },
    withState(initialAttachementState),
    withComputed((store, _service = inject(WenService), devis = inject(LigneDevisStore), constat = inject(ConstatStore)) => (
        {
            taille: computed(() => {
                return store.attachement_data().length
            }),
            last_num: computed(() => {
                let devis_id = store.selected_devis_id();
                let attach = store.attachement_data().filter(x => x.devis_id == devis_id);
                if (attach.length > 0) {
                    let numeros = attach.map(x => x.numero);
                    return Math.max(...numeros);
                }
                else { return 0 }

            }),
            donnees_attachement: computed(() => {
                let devis_id = store.selected_devis_id();
                return store.attachement_data().filter(x => x.devis_id == devis_id)

            }),
            attachements: computed(() => {
                let taches = devis.taches_classees();
                let numero_attach = store.selected_num()
                let codes_parent = devis.donnees_Lignedevis().map(x => x.parent_code).filter(x => x != '');
                let donnees_attach: any[] = [];
                taches.forEach(element => {
                    let poste_id = element.id;
                    let qtite_periode = 0;
                    let qtite_prec = 0;
                    let qtite_cumul = 0;
                    if (!codes_parent.includes(element.code)) {
                        let constats = constat.constats_by_devis().filter(x => x.poste_id == poste_id && x.numero == numero_attach);
                        if (constats.length > 0) {
                            qtite_periode = _service.somme(constats.map(x => x.quantite_mois));
                        }

                        let last_constats = constat.constats_by_devis().filter(x => x.numero < numero_attach && x.poste_id == poste_id);
                        if (last_constats.length > 0) {
                            qtite_prec = _service.somme(last_constats.map(x => x.quantite_mois));
                        }
                        qtite_cumul = qtite_prec + qtite_periode;
                    }
                    donnees_attach.push({
                        'id': element.id,
                        'poste': element.poste,
                        'designation': element.designation,
                        'unite': element.unite,
                        'prix_u': element.prix_u,
                        'quantite_marche': element.quantite.toFixed(2),
                        'montant_marche': (element.quantite * element.prix_u).toFixed(2),
                        'quantite_prec': qtite_prec.toFixed(2),
                        'quantite_periode': qtite_periode.toFixed(2),
                        'quantite_cumul': qtite_cumul.toFixed(2),
                        'montant_prec': qtite_prec * element.prix_u,
                        'montant_periode': qtite_periode * element.prix_u,
                        'montant_cumul': qtite_cumul * element.prix_u,
                        'taux': element.quantite == 0 ? 0 : ((qtite_cumul / element.quantite) * 100).toFixed(2),
                        'code': element.code,
                        'parent_code': element.parent_code,
                        'numero': numero_attach
                    })
                });
                let init = donnees_attach.map(x => x.parent_code).filter(x => x != '')
                let codes: any = []
                donnees_attach.forEach(element => {
                    let montant = 0
                    if (!init.includes(element.code)) {
                        codes.push(element.parent_code)
                    }

                })
                let codes2: any = []
                donnees_attach.forEach((element: any) => {
                    if (codes.includes(element.code)) {
                        let filtres_Mmarche = donnees_attach.filter(x => x.parent_code == element.code).map(x => x.montant_marche)
                        let filtres_Mprec = donnees_attach.filter(x => x.parent_code == element.code).map(x => x.montant_prec)
                        let filtres_Mperiode = donnees_attach.filter(x => x.parent_code == element.code).map(x => x.montant_periode)
                        let filtres_Mcumul = donnees_attach.filter(x => x.parent_code == element.code).map(x => x.montant_cumul)
                        element.montant_marche = _service.somme(filtres_Mmarche)
                        element.montant_prec = _service.somme(filtres_Mprec)
                        element.montant_periode = _service.somme(filtres_Mperiode)
                        element.montant_cumul = _service.somme(filtres_Mcumul)
                        if (_service.somme(filtres_Mmarche) == 0) {
                            element.taux = 0
                        }
                        else {
                            element.taux = (_service.somme(filtres_Mcumul) / _service.somme(filtres_Mmarche) * 100).toFixed(2)
                        }

                        codes2.push(element.parent_code)
                    }
                });
                let codes3: any = []
                donnees_attach.forEach((element: any) => {
                    if (codes2.includes(element.code)) {
                        let filtres_Mmarche = donnees_attach.filter(x => x.parent_code == element.code).map(x => x.montant_marche)
                        let filtres_Mprec = donnees_attach.filter(x => x.parent_code == element.code).map(x => x.montant_prec)
                        let filtres_Mperiode = donnees_attach.filter(x => x.parent_code == element.code).map(x => x.montant_periode)
                        let filtres_Mcumul = donnees_attach.filter(x => x.parent_code == element.code).map(x => x.montant_cumul)
                        element.montant_marche = _service.somme(filtres_Mmarche)
                        element.montant_prec = _service.somme(filtres_Mprec)
                        element.montant_periode = _service.somme(filtres_Mperiode)
                        element.montant_cumul = _service.somme(filtres_Mcumul)
                        if (_service.somme(filtres_Mmarche) == 0) {
                            element.taux = 0
                        }
                        else {
                            element.taux = (_service.somme(filtres_Mcumul) / _service.somme(filtres_Mmarche) * 100).toFixed(2)
                        }
                        codes3.push(element.parent_code)
                    }
                });

                return donnees_attach;
            }
            )
        }
    )),
    withMethods((store,
        monservice = inject(WenService),
        _task_service = inject(TaskService),
        snackbar = inject(MatSnackBar)) =>
    (
        {
            setPathString(path: string) {
                patchState(store, { path_string: path })
            },
            filtrebyDevisId(devis_id: string) {
                patchState(store, { selected_devis_id: devis_id })
            },
            filtrebyNumero(numero: number) {
                patchState(store, { selected_num: numero })
            },
            loadAttachements: rxMethod<void>(pipe(switchMap(() => {
                return _task_service.getallModels(store.path_string()).pipe(
                    tap({
                        next: (attachements) => {
                            patchState(store, { attachement_data: attachements })
                        },
                        error: () => {
                            Showsnackerbaralert('impossible de charger les données', 'fail', snackbar)
                        }
                    }))
            })))
            ,
            AddAttachement: rxMethod<any>(pipe(
                switchMap((attachement) => {
                    return _task_service.addModel(store.path_string(), attachement).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            RemoveAttachement: rxMethod<string>(pipe(
                switchMap((id) => {
                    return _task_service.deleteModel(store.path_string(), id).pipe(tap({
                        next: () => {
                            Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                        }, error: () => {
                            Showsnackerbaralert('échoué', 'fail', snackbar)
                        }
                    }

                    ))
                }))),
            updateAttachement: rxMethod<any>(pipe(
                switchMap((attachement) => {
                    return _task_service.updateModel(store.path_string(), attachement).pipe(
                        tap({
                            next: () => {
                                var data = store.attachement_data()
                                var index = data.findIndex(x => x.id == attachement.id)
                                data[index] = attachement
                                patchState(store, { attachement_data: data })
                                Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )), RemoveManyAttach: rxMethod<ModelAttachement[]>(pipe(
                switchMap((donnees) => {
                    let obs: Observable<any>[] = []
                    for (let row of donnees) {
                        obs.push(_task_service.deleteModel(store.path_string(), row.id))
                    }
                    return concat(obs)
                })
            ))
        }
    ))


)
export const DecompteStore = signalStore(
    { providedIn: 'root' },
    withState(initialDecompteState),
    withComputed((store, _service = inject(WenService), devis = inject(LigneDevisStore), constat = inject(ConstatStore)) => (
        {
            taille: computed(() => {
                return store.decompte_data().filter(x => x.devis_id == devis.selectedDevis_id()).length
            }),
            last_num: computed(() => {
                let decompte = store.decompte_data().filter(x => x.devis_id == devis.selectedDevis_id());
                if (decompte.length > 0) {
                    let numeros = decompte.map(x => x.numero);
                    return Math.max(...numeros);
                }
                else { return 0 }

            }),
            donnees_decompte: computed(() => {
                return store.decompte_data().filter(x => x.devis_id == devis.selectedDevis_id());

            })
        }
    )),
    withMethods((store,
        _task_service = inject(TaskService),
        snackbar = inject(MatSnackBar)) =>
    (
        {
            setPathString(path: string) {
                patchState(store, { path_string: path })
            },
            filtrebyNumero(numero: number) {
                patchState(store, { selected_num: numero })
            },
            loadAllDecomptes: rxMethod<void>(pipe(switchMap(() => {
                return _task_service.getallModels(store.path_string()).pipe(
                    tap({
                        next: (dp) => {
                            patchState(store, { decompte_data: dp })
                        },
                        error: () => {
                            Showsnackerbaralert('impossible de charger les données', 'fail', snackbar)
                        }
                    }))
            })))
            ,
            AddDecompte: rxMethod<any>(pipe(
                switchMap((dp) => {
                    return _task_service.addModel(store.path_string(), dp).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            RemoveDecompte: rxMethod<string>(pipe(
                switchMap((id) => {
                    return _task_service.deleteModel(store.path_string(), id).pipe(tap({
                        next: () => {
                            Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                        }, error: () => {
                            Showsnackerbaralert('échoué', 'fail', snackbar)
                        }
                    }

                    ))
                }))),
            updateDecompte: rxMethod<any>(pipe(
                switchMap((attachement) => {
                    return _task_service.updateModel(store.path_string(), attachement).pipe(
                        tap({
                            next: () => {
                                var data = store.decompte_data()
                                var index = data.findIndex(x => x.id == attachement.id)
                                data[index] = attachement
                                patchState(store, { decompte_data: data })
                                Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            ))
            , RemoveManyDecompte: rxMethod<ModelDecompte[]>(pipe(
                switchMap((donnees) => {
                    let obs: Observable<any>[] = []
                    for (let row of donnees) {
                        obs.push(_task_service.deleteModel(store.path_string(), row.id))
                    }
                    return forkJoin(obs)
                })
            ))
        }
    ))


)
export const UnitesStore = signalStore(
    { providedIn: 'root' },
    withState(initialUnitesState),
    withComputed((store) => (
        {
            taille: computed(() => store.unites_data().length),
            unites: computed(() => {
                return store.unites_data().sort((a, b) => {
                    return a.unite.localeCompare(b.unite)
                })
            })
        }
    )
    ),
    withMethods((
        store,
        _task_service = inject(TaskService),
        snackbar = inject(MatSnackBar)) =>
    (
        {
            setPathString(path: string) {
                patchState(store, { path_string: path })
            },
            loadUnites: rxMethod<void>(pipe(switchMap(() => {
                return _task_service.getallModels(store.path_string()).pipe(
                    tap((data) => {
                        patchState(store, { unites_data: data })
                    })
                )
            }
            ))),
            addUnite: rxMethod<any>(pipe(
                switchMap((unite) => {
                    return _task_service.addModel(store.path_string(), unite).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            }, error: () => {
                                patchState(store, { message: "échoué" });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            removeUnite: rxMethod<string>(pipe(
                switchMap((id) => {
                    return _task_service.deleteModel(store.path_string(), id).pipe(tap(
                        {
                            next: () => {
                                Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                            },
                            error: () => {
                                patchState(store, { message: 'echoué' });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }

                    ))
                }))),
            updateUnite: rxMethod<any>(pipe(
                switchMap((unite) => {
                    return _task_service.updateModel(store.path_string(), unite).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            ))

        }
    ))
)
export const TachesStore = signalStore(
    { providedIn: 'root' },
    withState(initialTachesState),
    withComputed((store) => (
        {
            taille: computed(() => store.taches_data().length),
            taches: computed(() => {
                return store.taches_data().sort((a, b) => {
                    return a.designation.localeCompare(b.designation)
                })
            })
        }
    )
    ),
    withMethods((store, _task_service = inject(TaskService), snackbar = inject(MatSnackBar)) =>
    (
        {
            setPathString(path: string) {
                patchState(store, { path_string: path })
            },
            loadTaches: rxMethod<void>(pipe(switchMap(() => {
                return _task_service.getallModels(store.path_string()).pipe(
                    tap((data) => {
                        patchState(store, { taches_data: data })
                    })
                )
            }
            ))),
            addTache: rxMethod<any>(pipe(
                switchMap((tache) => {
                    return _task_service.addModel(store.path_string(), tache).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            }, error: () => {
                                patchState(store, { message: "échoué" });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            removeTache: rxMethod<string>(pipe(
                switchMap((id) => {
                    return _task_service.deleteModel(store.path_string(), id).pipe(tap(
                        {
                            next: () => {
                                Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                            },
                            error: () => {
                                patchState(store, { message: 'echoué' });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }

                    ))
                }))),
            updateTache: rxMethod<any>(pipe(
                switchMap((tache) => {
                    return _task_service.updateModel(store.path_string(), tache).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            ))

        }
    ))
)
export const TachesEnginsStore = signalStore(
    { providedIn: 'root' },
    withState(initialTacheEnginsState),
    withComputed((store) => (
        {
            taille: computed(() => store.taches_data().length),
            tachesEngins: computed(() => {
                return store.taches_data().sort((a, b) => {
                    return a.taches.localeCompare(b.taches)
                })
            })
        }
    )
    ),
    withMethods((store, monservice = inject(WenService), snackbar = inject(MatSnackBar)) =>
    (
        {
            loadTachesEngins: rxMethod<void>(pipe(switchMap(() => {
                return monservice.getallTachesEngins().pipe(
                    tap((data) => {
                        patchState(store, { taches_data: data })
                    })
                )
            }
            ))),
            addTacheEngins: rxMethod<any>(pipe(
                switchMap((tache) => {
                    return monservice.addTachesEngins(tache).pipe(
                        tap({
                            next: () => {
                                const updatedonnes = [...store.taches_data(), tache]
                                patchState(store, { taches_data: updatedonnes })
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            }, error: () => {
                                patchState(store, { message: "échoué" });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            removeTacheEngins: rxMethod<string>(pipe(
                switchMap((id) => {
                    return monservice.deleteTachesEngins(id).pipe(tap(
                        {
                            next: () => {
                                const updatedonnes = store.taches_data().filter(x => x.id != id)
                                patchState(store, { taches_data: updatedonnes })
                                Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                            },
                            error: () => {
                                patchState(store, { message: 'echoué' });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }

                    ))
                }))),
            updateTacheEngins: rxMethod<any>(pipe(
                switchMap((tache) => {
                    return monservice.updateTachesEngins(tache).pipe(
                        tap({
                            next: () => {
                                var data = store.taches_data()
                                var index = data.findIndex(x => x.id == tache.id)
                                data[index] = tache
                                patchState(store, { taches_data: data })
                                Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            ))

        }
    ))
)
/*********************** */
export const TacheProjetStore = signalStore(
    { providedIn: 'root' },
    withState(initialTacheProjetState),
    withComputed((store) => (
        {
            taille: computed(() => store.taches_data().length),
            donnees_taches_projet: computed(() => {
                let projet_id = store.selectedProjetId();
                let tachesbyprojet = store.taches_data().filter(x => x.projetId == projet_id);
                return tachesbyprojet;
            })
        }
    )
    ),
    withMethods((store, monservice = inject(WenService), snackbar = inject(MatSnackBar)) =>
    (
        {
            filtrebyProjetId(projetId: string) {
                patchState(store, { selectedProjetId: projetId })
            },
            filtrebyTacheId(tacheId: string) {
                patchState(store, { selectedTacheId: tacheId })
            },
            loadTachesProjet: rxMethod<void>(pipe(switchMap(() => {
                return monservice.getAllTachesProjet().pipe(
                    tap((data) => {
                        patchState(store, { taches_data: data });
                    })
                )
            }
            ))),
            addTacheProjet: rxMethod<any>(pipe(
                switchMap((tache) => {
                    return monservice.addTachesProjet(tache).pipe(
                        tap({
                            next: () => {
                                const updatedonnes = [...store.taches_data(), tache]
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            }, error: () => {
                                patchState(store, { message: "échoué" });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            removeTacheProjet: rxMethod<string>(pipe(
                switchMap((id) => {
                    return monservice.deleteTachesProjet(id).pipe(tap(
                        {
                            next: () => {
                                const updatedonnes = store.taches_data().filter(x => x.id != id)
                                patchState(store, { taches_data: updatedonnes })
                                Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                            },
                            error: () => {
                                patchState(store, { message: 'echoué' });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }

                    ))
                }))),
            updateTacheProjet: rxMethod<any>(pipe(
                switchMap((tache) => {
                    return monservice.updateTachesProjet(tache).pipe(
                        tap({
                            next: () => {
                                var data = store.taches_data();
                                var index = data.findIndex(x => x.id == tache.id)
                                data[index] = tache
                                patchState(store, { taches_data: data })
                                Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            ))

        }
    ))
)
export const EntrepriseStore = signalStore(
    { providedIn: 'root' },
    withState(initialEntrepriseState),
    withComputed((store) => (
        {
            taille: computed(() => store.liste_entreprise().length),
            donnees_entreprise: computed(() => {
                return store.liste_entreprise();
            })
        }
    )
    ),
    withMethods((store, _task_service = inject(TaskService), snackbar = inject(MatSnackBar)) =>
    (
        {
            loadEntreprises: rxMethod<void>(pipe(switchMap(() => {
                return _task_service.getallModels("entreprises").pipe(
                    tap((data) => {
                        patchState(store, { liste_entreprise: data });
                    })
                )
            }
            ))),
            addEntreprise: rxMethod<any>(pipe(
                switchMap((entreprise) => {
                    return _task_service.addModel("entreprises", entreprise).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            }, error: () => {
                                patchState(store, { message: "échoué" });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            removeEntreprise: rxMethod<string>(pipe(
                switchMap((id) => {
                    return _task_service.deleteModel("entreprises", id).pipe(tap(
                        {
                            next: () => {
                                Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                            },
                            error: () => {
                                patchState(store, { message: 'echoué' });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }

                    ))
                }))),
            updateEntreprise: rxMethod<any>(pipe(
                switchMap((entreprise) => {
                    return _task_service.updateModel("entreprises", entreprise).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            ))

        }
    ))
)
export const PointageTrvxStore = signalStore(
    { providedIn: 'root' },
    withState(initialPointageTrvxState),
    withComputed((store) => (
        {
            taille: computed(() => store.pointage_data().length),
            donnees_pointage_trvx: computed(() => {
                let date = store.selectedDate();
                let projet_id = store.selectedProjetId();
                return store.pointage_data().find(x =>
                    x.date == date && x.projetId == projet_id
                );
            })
        }
    )
    ),
    withMethods((store, monservice = inject(WenService), snackbar = inject(MatSnackBar)) =>
    (
        {
            filtrebyDate(date: string) {
                patchState(store, { selectedDate: date })
            },
            filtrebyProjetId(projetId: string) {
                patchState(store, { selectedProjetId: projetId })
            },
            loadPointageTrvx: rxMethod<void>(pipe(switchMap(() => {
                return monservice.getAllPointage_travaux().pipe(
                    tap((data) => {

                        let mydata: pointage_travaux[] = [];
                        data.forEach(element => {
                            let pointage_mach: any = [];
                            let engins_id = element.engin_id;
                            let tache_id = element.tache_id;
                            let duree = element.duree;
                            for (let i in engins_id) {
                                let myuuid = uuidv4();
                                pointage_mach.push({
                                    'id': myuuid,
                                    'engin_id': engins_id[i],
                                    'tache_id': tache_id[i],
                                    'duree': duree[i]
                                })
                            }
                            let metre_travaux: any = [];

                            let tache_projet_id = element.tache_projet_id;
                            let taches_projet_exec = element.quantite_exec;
                            for (let i in tache_projet_id) {
                                metre_travaux.push({
                                    'tache_projet_id': tache_projet_id[i],
                                    'quantite_exec': taches_projet_exec[i]
                                })
                            }
                            mydata.push({
                                'id': element.id,
                                'projetId': element.projetId,
                                'date': element.date,
                                'pointage_mach': pointage_mach,
                                'metre_travaux': metre_travaux
                            })
                        });
                        patchState(store, { pointage_data: mydata });
                    })
                )
            }
            ))),
            addPointageTrvx: rxMethod<any>(pipe(
                switchMap((pointage) => {
                    return monservice.addPointage_travaux(pointage).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            }, error: () => {
                                patchState(store, { message: "échoué" });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            removePointageTrvx: rxMethod<string>(pipe(
                switchMap((id) => {
                    return monservice.deletePointage_travaux(id).pipe(tap(
                        {
                            next: () => {
                                const updatedonnes = store.pointage_data().filter(x => x.id != id)
                                patchState(store, { pointage_data: updatedonnes })
                                Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                            },
                            error: () => {
                                patchState(store, { message: 'echoué' });
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }

                    ))
                }))),
            updatePointageTrvx: rxMethod<any>(pipe(
                switchMap((entreprise) => {
                    return monservice.updatePointage_travaux(entreprise).pipe(
                        tap({
                            next: () => {
                                var data = store.pointage_data();
                                var index = data.findIndex(x => x.id == entreprise.id)
                                data[index] = entreprise
                                patchState(store, { pointage_data: data })
                                Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            updatePointageMach: rxMethod<any>(pipe(
                switchMap((donnees) => {
                    return monservice.updateByMachine(donnees).pipe(
                        tap({
                            next: () => {
                                //Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),
            updatePointageMetre: rxMethod<any>(pipe(
                switchMap((donnees) => {
                    return monservice.updateByMetre(donnees).pipe(
                        tap({
                            next: () => {
                                //Showsnackerbaralert('modifié avec succes', 'pass', snackbar)
                            }, error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            ))

        }
    ))
)
export const CompteStore = signalStore(
    { providedIn: 'root' },
    withState(initialCompte),
    withComputed((store) => (
        {
            donnees_engins: computed(
                () => {
                    let enginName = store.selected_engin();
                    if (enginName == '') {
                        return store.engins()
                    } else {
                        return store.engins().filter(
                            x => x.designation.toUpperCase().includes(enginName)
                        )
                    }
                }
            ),
            donnees_personnel: computed(
                () => {
                    let personneName = store.selected_personnel()
                    if (personneName == '') {
                        return store.personnel();
                    }
                    else {
                        return store.personnel().filter(
                            x => (x.nom + x.prenom).toUpperCase().includes(personneName)
                        )
                    }
                }
            )
            ,
            donnees_classesEngins: computed(
                () => {
                    return store.classes_engins();
                }
            )
        }
    )
    ),
    withMethods((store, monservice = inject(TaskService), snackbar = inject(MatSnackBar)) =>
    (
        {
            filterEngin(enginName: string) {
                patchState(store,
                    {
                        selected_engin: enginName.toUpperCase()
                    }
                )
            }
            ,
            filterPersonnel(personnelName: string) {
                patchState(store,
                    {
                        selected_personnel: personnelName.toUpperCase()
                    }
                )
            }
            ,
            /*  loadData: rxMethod<void>(
                 pipe(
                     switchMap(
                         () => {
                             let observ_engins = monservice.getallEngins().pipe(
                                 tap(resp => {
                                     console.log("ok")
                                     patchState(store,
                                         {
                                             engins: resp.sort((a, b) => {
                                                 return a.designation.localeCompare(b.designation)
                                             })
                                         }
                                     )
                                 }
                                 )
                             );
                             let observ_personnel = monservice.getallPersonnel().pipe(
                                 tap(resp => {
                                     patchState(store,
                                         {
                                             personnel: resp.sort((a, b) => {
                                                 return (a.nom + a.prenom).localeCompare(b.nom + b.prenom)
                                             })
                                         }
                                     )
                                 }
                                 )
                             );
                             let observ_classes_engins = monservice.getallClassesEngins().pipe(
                                 tap(resp => {
                                     patchState(store,
                                         {
                                             classes_engins: resp.sort((a, b) => {
                                                 return a.designation.localeCompare(b.designation)
                                             })
                                         }
                                     )
                                 }
                                 )
                             );
                             let observ_conso_go = monservice.getallConsogo().pipe(
                                 tap(resp => {
                                     patchState(store,
                                         {
                                             conso_go: resp
                                         }
                                     )
                                 }
                                 )
                             );
                             let observ_appro_go = monservice.getAllApproGo().pipe(
                                 tap(resp => {
                                     patchState(store,
                                         {
                                             appro_go: resp
                                         }
                                     )
                                 }
                                 )
                             );
                             let observ_pannes = monservice.getAllPannes().pipe(
                                 tap(resp => {
                                     patchState(store,
                                         {
                                             pannes: resp
                                         }
                                     )
                                 }
                                 )
                             );
                             return concat(
                                 [
                                     observ_engins,
                                     observ_personnel,
                                     observ_classes_engins,
                                     observ_conso_go,
                                     observ_appro_go,
                                     observ_pannes
                                 ]
                             )
                         }
                     )
                 )), */
            addEngins: rxMethod<any>(
                pipe(
                    switchMap(
                        data => {
                            return monservice.addEngins(data).pipe(
                                tap(
                                    {
                                        next: () => {
                                            //const updatedonnes = [...store.engins(), data]
                                            //patchState(store, { engins: updatedonnes })
                                            Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                                        }
                                    }
                                )
                            )
                        }
                    )
                )
            ),
            addPersonnel: rxMethod<any>(
                pipe(
                    switchMap(
                        data => {
                            return monservice.addPersonnel(data).pipe(
                                tap(
                                    {
                                        next: () => {
                                            //const updatedonnes = [...store.personnel(), data]
                                            // patchState(store, { personnel: updatedonnes })
                                            Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                                        }
                                    }
                                )
                            )
                        }
                    )
                )
            ),
            updateEnginsCompte: rxMethod<any>(
                pipe(switchMap(engin => {
                    return monservice.updateEngins(engin).pipe(
                        tap(() => {
                            //var mydata = store.engins();
                            //var index = mydata.findIndex(x => x.id == engin.id);
                            // mydata[index] = engin;
                            //patchState(store, { engins: mydata })
                        })
                    )
                }))

            ),
            updatePersonnelCompte: rxMethod<any>(
                pipe(switchMap(personnel => {
                    return monservice.updatePersonnel(personnel).pipe(
                        tap(() => {
                            //var mydata = store.personnel();
                            //var index = mydata.findIndex(x => x.id == personnel.id);
                            //mydata[index] = personnel;
                            // patchState(store, { personnel: mydata })
                        })
                    )
                }))

            ),
            deletePersonnelCompte: rxMethod<string>(
                pipe(switchMap(id => {
                    return monservice.deletePersonnel(id).pipe(
                        tap(() => {
                            //var mydata = store.personnel();
                            //var data_reste = mydata.filter(x => x.id != id);
                            //patchState(store, { personnel: data_reste })
                        })
                    )
                }))

            ),
            deleteEnginCompte: rxMethod<string>(
                pipe(
                    switchMap(id => {
                        return monservice.deleteEngins(id).pipe(
                            tap(
                                () => {
                                    //var mydata = store.engins();
                                    //var data_reste = mydata.filter(x => x.id != id);
                                    //patchState(store, { engins: data_reste })
                                }
                            )
                        )
                    }
                    )
                )

            )
        }
    ))
)
export const DatesStore = signalStore(
    { providedIn: 'root' },
    withState(initialDatesState),
    withComputed((store) => (
        {
            taille: computed(() => {
                return store.dates().length
            }),
            donnees_dates: computed(() => {
                return store.dates()
            })

        }
    )),
    withMethods((store,
        monservice = inject(WenService),
        snackbar = inject(MatSnackBar)
    ) =>
    (
        {
            loaddates(data: tab_personnel[]) {
                let dates = data.map(x => x.dates);
                let result: any = []
                dates.forEach(element => {
                    result = [...result, ...element]
                });
                let unique_dates = result.filter((value: any, index: any, self: any) => self.indexOf(value) === index)
                patchState(store, { dates: unique_dates.map((x: any) => { return { dates: x } }) })
            }
            ,
            adddates: rxMethod<datesPointages>(pipe(
                switchMap((dates) => {
                    return monservice.adddates(dates).pipe(
                        tap({
                            next: () => {
                                const updatedonnes = [...store.dates(), dates]
                                patchState(store, { dates: updatedonnes })
                            }, error: () => { Showsnackerbaralert('échoué', 'fail', snackbar) }
                        }
                        )
                    )
                })
            ))
        }
    ))
)
export const SstraitantStore = signalStore(
    { providedIn: 'root' },
    withState(initialSstraitantState),
    withComputed((store) => (
        {
            taille: computed(() => store.sstraitant_data().length),
            donnees_sstraitant: computed(() => {
                return classeSstraitant(store.sstraitant_data())
            }),
            donnees_sstraitantById: computed(() => {
                var ind = store.selectedId
                let data: sous_traitant | undefined = store.sstraitant_data().find(x => x.id == ind())
                return data
            })
        }
    )
    ),
    withMethods((store,
        _task_service = inject(TaskService),
        snackbar = inject(MatSnackBar)) =>
    (
        {
            setPathString(path: string) {
                patchState(store, { path_string: path })
            },
            filtrebyId(id: string) {
                patchState(store, { selectedId: id })
            },
            loadSstraitants: rxMethod<void>(pipe(switchMap(() => {
                return _task_service.getallModels(store.path_string()).pipe(
                    tap((data) => {
                        patchState(store, { sstraitant_data: classeSstraitant(data) })
                    })
                )
            }
            ))),
            addSstraitant: rxMethod<sous_traitant>(pipe(
                switchMap((sstraitant) => {
                    return _task_service.addModel(store.path_string(), sstraitant).pipe(
                        tap({
                            next: () => {

                                Showsnackerbaralert('ajouté avec succes', 'pass', snackbar)
                            }, error: () => { Showsnackerbaralert('échoué', 'fail', snackbar) }
                        }
                        )
                    )
                })
            )),
            removeSstraitant: rxMethod<string>(pipe(
                switchMap((id) => {
                    return _task_service.deleteModel(store.path_string(), id).pipe(tap({
                        next: () => {

                            Showsnackerbaralert('élément supprimé', 'pass', snackbar)
                        }, error: () => {
                            Showsnackerbaralert('échoué', 'fail', snackbar)
                        }
                    }

                    ))
                }))),
            updateSstraitant: rxMethod<sous_traitant>(pipe(
                switchMap((sstraitant) => {
                    return _task_service.updateModel(store.path_string(), sstraitant).pipe(
                        tap({
                            next: () => {
                                Showsnackerbaralert('modifié avec succès', 'pass', snackbar)
                            },
                            error: () => {
                                Showsnackerbaralert('échoué', 'fail', snackbar)
                            }
                        }
                        )
                    )
                })
            )),

        }
    ))
)
function convertDate(strdate: string): Date {
    const [day1, month1, year1] = strdate.split("/")
    const date1 = new Date(+year1, +month1 - 1, +day1)
    return date1
}
function classeTabDate(mytable: any[]) {
    return mytable.sort((a, b) => { return new Date(convertDate(b.date)).getTime() - new Date(convertDate(a.date)).getTime() });
}
function classeTabDateGas(mytable: Gasoil[]) {
    return mytable.sort((a, b) => new Date(convertDate(b.date)).getTime() - new Date(convertDate(a.date)).getTime());
}
function classeTabBynumero(mytable: Gasoil[]) {
    return mytable.sort((a, b) => b.numero - a.numero);
}
function classeTabBynumeroDec(mytable: Gasoil[]) {
    return mytable.sort((a, b) => Number(a.numero) - Number(b.numero));
}
function classeTabDatePanne(mytable: Pannes[]) {
    return mytable.sort((a, b) => new Date(convertDate(b.debut_panne)).getTime() - new Date(convertDate(a.debut_panne)).getTime());
}
function classeTabDatePannes(mytable: Pannes[]) {
    return mytable.sort((a, b) => new Date(convertDate(b.debut_panne)).getTime() - new Date(convertDate(a.debut_panne)).getTime());
}
function somme(tab: any) {
    let som = 0
    for (let row of tab) {
        som = som + Number(row)
    }
    return som
}
function classement(mytable: string[]) {
    return mytable.sort((a: string, b: string) => {
        const [day1, month1, year1] = a.split("/")
        const [day2, month2, year2] = b.split("/")
        const date1 = new Date(+year1, +month1 - 1, +day1)
        const date2 = new Date(+year2, +month2 - 1, +day2)
        return date2.getTime() - date1.getTime()
    });
}
function classeEngins(mytable: Engins[]) {
    return mytable.sort((a, b) => a.designation.localeCompare(b.designation));
}
function classePersonnel(mytable: tab_personnel[]) {
    return mytable.sort((a, b) => (a.nom + a.prenom).localeCompare(b.nom + b.prenom));
}
function classeProjet(mytable: Projet[]) {
    return mytable.sort((a, b) => (a.id.localeCompare(b.id)));
}
function classeSstraitant(mytable: sous_traitant[]) {
    return mytable.sort((a, b) => (a.entreprise.localeCompare(b.entreprise)));
}
function classeRessources(mytable: tab_ressources[]) {
    return mytable.sort((a, b) => (a.designation.localeCompare(b.designation)));
}

function classement_classes(mytable: classe_engins[]) {
    return mytable.sort((a, b) => a.designation.localeCompare(b.designation));
}
function classement_Ldevis(mytable: Ligne_devis[]) {
    return mytable.sort((a, b) => (a.code.toString()).localeCompare(b.code.toString()));
}
function Showsnackerbaralert(message: string, resptype: string = 'fail', _snackbar: MatSnackBar) {
    let _class = resptype == 'pass' ? 'text-green' : 'text-red';
    let a = _snackbar.open(message, 'ok',
        {
            verticalPosition: 'top',
            horizontalPosition: 'end',
            duration: 3000,
            panelClass: [_class]

        })
    return a
}
