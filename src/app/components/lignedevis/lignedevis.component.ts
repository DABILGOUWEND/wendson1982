import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, computed, effect, inject, model, OnInit, signal } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { element_devis } from '../../models/modeles';
import { ImportedModule } from '../../modules/imported/imported.module';
import { TaskService } from '../../task.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DevisStore, SstraitantStore } from '../../store/appstore';
import { AuthenService } from '../../authen.service';
import { BehaviorSubject } from 'rxjs';

interface ExampleFlatNode {
  expandable: boolean,
  poste: string,
  designation: string,
  prix_u: number | null,
  unite: string,
  quantite: number | null,
  level: number,
  montant: number | null,
}


@Component({
  selector: 'app-lignedevis',
  standalone: true,
  imports: [ImportedModule],
  templateUrl: './lignedevis.component.html',
  styleUrl: './lignedevis.component.scss'
})
export class LignedevisComponent implements OnInit {
  _devis_store = inject(DevisStore);
  _ssTraitance_store = inject(SstraitantStore);
  _auth_service = inject(AuthenService);
  flatNodeMap = new Map<ExampleFlatNode, element_devis>();
  row_color = ['#5094D8', '#93B3BF', 'white', 'white', 'lightyellow', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen'];
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<element_devis, ExampleFlatNode>();
  ligne_cliquer = signal(Infinity)
  current_poste = signal('')
  current_designation = signal('')
  current_unite = signal<string>('')
  current_prix = signal<number | null>(0)
  current_quantite = signal<number | null>(0)
  current_montant = signal<number | null>(0)
  current_devis_id = signal('')
  //signal
  is_table_updated = signal(false);
  is_table_opened = signal(false);
  selected_row = signal<element_devis | undefined>(undefined);

  displayedColumns = ['poste', 'designation', 'unite', 'prix_u', 'quantite', 'montant', 'actions'];
  dataChange: BehaviorSubject<element_devis[]> = new BehaviorSubject<element_devis[]>([]);
  constructor(private fb: FormBuilder) {
    this.table_update_form = this.fb.group({
      poste: new FormControl('', [Validators.required]),
      designation: new FormControl('', [Validators.required]),
      prix_u: new FormControl(0),
      unite: new FormControl(''),
      quantite: new FormControl(0),
    });
    effect(() => {
      let data = this._devis_store.donnees_currentDevis()?.data
      if (data)
        this.dataChange.next(data)
    })


  }

  table_update_form: FormGroup
  data_source = signal<element_devis[]>([]);
  ngOnInit() {
    this._devis_store.setPathString('comptes/' + this._auth_service.current_projet_id() + '/devis');
    this._ssTraitance_store.setPathString('comptes/' + this._auth_service.current_projet_id() + '/sous_traitants');
    this._devis_store.loadDevis();
    this._ssTraitance_store.loadSstraitants();

    this.dataChange.subscribe((data: element_devis[]) => {
      this.dataSource.data = data;
      this.treeControl.expandAll();
      for (let i = this.treeControl.dataNodes.length - 1; i >= 0; i--) {
        let parent = this.getParentNode(this.treeControl.dataNodes[i]);
        if (parent) {
          let montantNode = this.treeControl.dataNodes[i].montant;
          let montantNodeExist = parent.montant;
          let parentmont = (montantNodeExist ? montantNodeExist : 0) + (montantNode ? montantNode : 0);
          parent.montant = parentmont;
        }
      }
    });
  }
  liste_devis = computed(() => {
    let donnees: any = []
    this._devis_store.donnees_devis().forEach(ent => {
      let entreprise = this._ssTraitance_store.donnees_sstraitant().find(e => e.id == ent.entreprise_id);
      donnees.push({
        id: ent.id,
        entreprise: entreprise ? entreprise.enseigne : ''
      });
    })
    return donnees;

  })

  transformer = (node: element_devis, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);

    const flatNode = existingNode && (existingNode.poste === node.poste

    )
      ? existingNode
      : {
        poste: node.poste,
        designation: node.designation,
        prix_u: node.prix_u,
        unite: node.unite,
        quantite: node.quantite,
        expandable: !!node.children && node.children.length > 0,
        level: level,
        montant: 0
      };
    flatNode.poste = node.poste;
    flatNode.designation = node.designation;
    flatNode.prix_u = node.prix_u;
    flatNode.unite = node.unite;
    flatNode.quantite = node.quantite;
    flatNode.expandable = !!node.children && node.children.length > 0;
    flatNode.level = level;

    if (node.children.length == 0) {

      flatNode.montant = (node.prix_u ? node.prix_u : 0) * (node.quantite ? node.quantite : 0);
    }
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  updateTableData() {
    if (this.table_update_form.valid) {
      let row = this.selected_row();
      let data = this.table_update_form.value;
      if (this.is_table_updated()) {
        if (row) {
          row.poste = data.poste;
          row.designation = data.designation;
          row.prix_u = data.prix_u;
          row.unite = data.unite ? data.unite : '';
          row.quantite = data.quantite;
        }
      } else {
        if (row) {
          let child =
          {
            poste: data.poste,
            designation: data.designation,
            prix_u: data.prix_u,
            unite: data.unite,
            quantite: data.quantite,
            children: []
          }
          row.children.push(child);
          row.unite = '';
          row.prix_u = null
          row.quantite = null
        }
      }
      this.save();
    }
    this.is_table_opened.set(false);
  }
  annuler() {
    this.is_table_opened.set(false);
  }

  modif(data: any) {
    this.is_table_opened.set(true);
    this.selected_row.set(this.flatNodeMap.get(data));
    //this.is_table_updated.set(true);
    this.table_update_form.patchValue(data);
  }
  addrow(data: ExampleFlatNode) {
    let flatenNode = this.flatNodeMap.get(data)
    
    this.selected_row.set(flatenNode);
    this.is_table_updated.set(false);
    if (data.prix_u && data.quantite) {
      if (confirm('la création d\'une ligne fille modifiera le montant de la ligne parente, voulez-vous continuer?')) {
        if (flatenNode) {
          flatenNode.prix_u = null;
          flatenNode.quantite = null;
          flatenNode.unite = '';
          let nestedNode = this.nestedNodeMap.get(flatenNode);
          if (nestedNode) {
            nestedNode.montant = 0;
          }
        }
        this.new_ligne(flatenNode)
      }
    } else {
      this.new_ligne(flatenNode)
    }

}
  delete(node: ExampleFlatNode) {
    if (confirm('Voulez-vous vraiment supprimer cette ligne?')) {
      let nodeFlat = this.flatNodeMap.get(node);
      if (nodeFlat) {
        const parentNode = this.getParentNode(node);
        if (parentNode) {
          let parentFlat = this.flatNodeMap.get(parentNode);
          if (!parentFlat || nodeFlat.children.length > 0) {
            alert('Impossible de supprimer la ligne car elle contient des lignes filles');
          } else {
            parentFlat.children = parentFlat.children.filter(c => c.poste !== node.poste);
            this.save();
          }
        } else {
          alert('Impossible de supprimer la ligne car elle est la racine');

        }
      }

    }
  }
  public getLevel = (node: ExampleFlatNode) => node.level

  public getParentNode(node: ExampleFlatNode): ExampleFlatNode | undefined {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return undefined;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return undefined;
  }

  modif_data(ind: number, node: ExampleFlatNode) {
    this.selected_row.set(this.flatNodeMap.get(node));
    this.ligne_cliquer.set(ind);
    this.current_poste.set(node.poste);
    this.current_designation.set(node.designation);
    this.current_unite.set(node.unite);
    this.current_prix.set(node.prix_u);
    this.current_quantite.set(node.quantite);
    this.current_montant.set(node.montant)
    this.is_table_updated.set(true);
  }
  saisie() {
    let prix = this.current_prix();
    let quantite = this.current_quantite();
    if (prix && quantite) {
      let montant = prix * quantite;
      let row = this.selected_row();
      this.current_montant.set(montant)

    }
  }
  update() {
    let row = this.selected_row();
    if (row) {
      if (row.children.length == 0) {
        row.poste = this.current_poste();
        row.designation = this.current_designation();
        row.prix_u = this.current_prix();
        row.unite = this.current_unite();
        row.quantite = this.current_quantite();
        let flatenNode = this.nestedNodeMap.get(row)
        if (flatenNode) {
          flatenNode.montant = this.current_montant()
        }
      } else {
        row.poste = this.current_poste();
      }
    }

    this.save();
    this.ligne_cliquer.set(Infinity);
  }
  close(data: ExampleFlatNode) {
    this.ligne_cliquer.set(Infinity);
    const parentNode = this.getParentNode(data);
    if (data.poste === '' && data.designation=='') {
      if (parentNode) {
        let parentFlat = this.flatNodeMap.get(parentNode);
        if (parentFlat)
          parentFlat.children = parentFlat.children.filter(c => c.poste !== '');
        this.dataChange.next(this.data_element())
      }
     
    }
  }

  save() {
    this._devis_store.addDataDevis(this.data_element())
    this.dataChange.next(this.data_element());
  }
  selecteDevis(devis_id: string) {
    this._devis_store.setCurrentDevisId(devis_id)
  }
  data_element(): element_devis[] { return this.dataChange.value; }

  new_ligne(flatenNode: element_devis | undefined) {
    if (flatenNode) {
      let child: element_devis = {
        poste: '',
        designation: '',
        prix_u: null,
        unite: '',
        quantite: null,
        children: []

      }
      flatenNode.children.push(child)
      this.dataChange.next(this.data_element());
      let nestedNode = this.nestedNodeMap.get(child);
      if (nestedNode) {
        let ind = this.treeControl.dataNodes.indexOf(nestedNode)
        this.modif_data(ind, nestedNode)
      }

    }
  }
}
