//Validation Logic
// eg. validatate(enteredTitle,true,minLength,min,max)

interface Validatable {
    value: string | number;  //title
    required?: boolean;
    minLength?: number;
    maxLength? : number;
    min?: number;
    max?: number;
}

function validate(validatableInput: Validatable) { 
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;

    }

    if (validatableInput.minLength !=null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength; 

    }

    if (validatableInput.maxLength !=null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }

    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.max
    }
    return isValid
}


//Autobind Decorator 
function autobind(
     //target: any
    // methodName : string
    _: any, 
   _2: string, 
    descriptor: PropertyDescriptor
    ) {

        const originalMethod = descriptor.value;
        const adjDescriptor: PropertyDescriptor ={
            configurable: true,
            get(){
                const boundFn = originalMethod.bind(this);
                return boundFn;
            }
        }
        return adjDescriptor;

}
// Project List Class of both Active project and Inactive Projects

class ProjectList {

    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    
    constructor(private type: 'active' | 'finished'){
    this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;
    this.attach()
    this.renderContent()

 }

 private renderContent()
 {
     const listId = `${this.type}-projects-list`;
     this.element.querySelector('ul')!.id = listId;
     this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
 }
 private attach()
 {
    this.hostElement.insertAdjacentElement('beforeend', this.element)
 }}

// Project Input Class
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement : HTMLInputElement;

    constructor(){
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        //console.log(this.element)
        this.element.id = 'user-input'
        console.log(this.element)

     this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
     this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
     this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
    
     this.configure()
     this.attach();
    }

    private gatherUSerInput(): [string,string,number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        const titleValidatable : Validatable = {
            value: enteredTitle,
            required: true,
            minLength: 1,
            maxLength: 100
        }

        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5,
            
        }

        const peopleValidatable : Validatable={
            value : enteredPeople,
            required: true,
            min: 1,
            
        }

        //if (enteredTitle.trim().length === 0 || enteredDescription.trim().length ===0 || enteredPeople.trim().length ===0) {
        if (!validate(titleValidatable) || !validate(descriptionValidatable) ||  !validate(peopleValidatable)) {
          alert('Invalid Input, Please try again')
            return;
        }
        else {
            return [enteredTitle ,enteredDescription, +enteredPeople];
        }


    }
    // clear inputs after submission
    private clearInputs(){
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value =''
    }

    @autobind
    private submitHandler (event: Event) {
        event.preventDefault();
        //console.log(this.titleInputElement.value)
      const userInput =  this.gatherUSerInput();
      if(Array.isArray(userInput)){
          const [title,desc,people] = userInput;
          console.log(title,desc,people);
          this.clearInputs();

      }

    }
    private configure() {
        this.element.addEventListener('submit', this.submitHandler)

   }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }

}

const prjInput = new ProjectInput()
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');