import mongoose from "mongoose";

const userSchema= mongoose.Schema({
    username:{type:String},
    email:{type:String},
    phone:{type:String},
    password:{type:String},
    cpassword:{type:String},
    accountType:{type:String},
    profile: { 
        type: String, 
        default: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJ3LTI0IGgtMjQiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZVdpZHRoPSIyIj48cGF0aCBzdHJva2VMaW5lY2FwPSJyb3VuZCIgc3Ryb2tlTGluZWpvaW49InJvdW5kIiBkPSJNMTIgMTJjMi40ODUgMCA0LjUtMi4wMTUgNC41LTQuNVMxNC40ODUgMyAxMiAzIDcuNSA1LjAxNSA3LjUgNy41IDkuNTE1IDEyIDEyIDEyWk0xOS41IDIxdjEtMi41YzAtMi40ODUtMi4wMTUtNC41LTQuNS00LjVoLTZjLTIuNDg1IDAtNC41IDIuMDE1LTQuNSA0LjVWMjEiLz48L3N2Zz4=' // Provide the default image URL here
      }

})

export default mongoose.model.users||mongoose.model('user',userSchema)