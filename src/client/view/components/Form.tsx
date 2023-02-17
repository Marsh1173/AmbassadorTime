// import React from "react";
// import { Component } from "react";

// export interface InputFieldData {
//   default_value?: string;
//   input_type: string;
// }

// export interface FormProps<Inputs extends string> {
//   input_field_data: Record<Inputs, InputFieldData>;
//   on_submit: (data: Record<Inputs, string>) => void;
//   title: string;
//   submit_label: string;
// }

// export type FormState<Inputs extends string> = Record<Inputs, string>;

// class Form<Inputs extends string> extends Component<
//   FormProps<Inputs>,
//   FormState<Inputs>
// > {
//   constructor(props: FormProps<Inputs>) {
//     super(props);

//     this.handleInputChange = this.handleInputChange.bind(this);
//   }

//   private handleInputChange(event) {
//     const target = event.target;
//     const value = target.type === "checkbox" ? target.checked : target.value;
//     const name = target.name;

//     this.setState({
//       [name]: value,
//     });
//   }

//   render() {
//     let inputs: JSX.Element[] = Object.keys(this.props.input_field_data).map(
//       (key) => {
//         return <input name={key}></input>;
//       }
//     );

//     return (
//       <form>
//         <label>
//           <span className="title">${this.props.title}</span>
//           <input
//             name="isGoing"
//             type="checkbox"
//             checked={this.state.isGoing}
//             onChange={this.handleInputChange}
//           />
//         </label>
//         <br />
//         <label>
//           Number of guests:
//           <input
//             name="numberOfGuests"
//             type="number"
//             value={this.state.numberOfGuests}
//             onChange={this.handleInputChange}
//           />
//         </label>
//         <input type={"submit"} value={this.props.submit_label}></input>
//       </form>
//     );
//   }
// }
