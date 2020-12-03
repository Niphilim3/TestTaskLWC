/**
 * Created by Aleksandr Mazan on 26-Nov-20.
 */

import {LightningElement, wire} from 'lwc';
import getListObjects from '@salesforce/apex/ObjectInformationController.getListObjects';
import getObjectInformation from '@salesforce/apex/ObjectInformationController.getSObjectDescribe';
import objectLabel from '@salesforce/label/c.Object';
import isAccessible from '@salesforce/label/c.IsAccessible';
import isCreateable from '@salesforce/label/c.IsCreateable';
import isUpdateable from '@salesforce/label/c.IsUpdateable';
import objectGeneralInfo from '@salesforce/label/c.Object_general_information';
import fieldInfo from '@salesforce/label/c.Fields_information';

const columns = [
    { label: 'Label', fieldName: 'label' },
    { label: 'Field type', fieldName: 'fieldType'},
    { label:  isAccessible, fieldName: 'isAccessible', type: 'boolean' },
    { label:  isCreateable, fieldName: 'isCreateable', type: 'boolean' },
    { label:  isUpdateable, fieldName: 'isUpdateable', type: 'boolean' },
];

export default class ObjectInformation extends LightningElement {

    generalObjectInfo = [];
    objectLabel = objectLabel;
    objectGeneralInfo = objectGeneralInfo;
    fieldInfo = fieldInfo;
    selectedObject;
    objectSelectList;
    objectInformation;
    error;
    columns = columns;
    isLoading = true;
    fieldsInfo;


    @wire(getListObjects)
    objectSelectList1({error, data}) {
        if (data) {
            this.objectSelectList = data;
            this.getObjectInfo(data[0].value);
        } else if (error) {
            console.log(error);
        }
    }

    handleChange(event) {
        this.isLoading = true;
        console.log(event.detail.value);
        this.getObjectInfo(event.detail.value);

    }

    getObjectInfo(objectApiName) {
        this.selectedObject = objectApiName;
        getObjectInformation({sObjectApiName: this.selectedObject})
            .then(result => {
                this.generalObjectInfo = [];
                this.fieldsInfo = result.fieldsInformation;
                for(let key in result.generalInfo) {
                    if (result.generalInfo.hasOwnProperty(key)) {
                        this.generalObjectInfo.push({value:result.generalInfo[key], key:key});
                    }
                }
                this.objectInformation = result;
                this.isLoading = false;
            })
            .catch(error => {
                this.generalObjectInfo = [];
                console.log(error);
                this.error = error;
                this.isLoading = false;
            });
    }
}