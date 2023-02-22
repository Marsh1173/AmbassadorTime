// import React, { ChangeEvent, FormEvent } from "react";
// import { Component } from "react";

// export interface FormInputOptions {
//   name: string,
//   type: string,

// }

// export interface FormProps {
//   on_submit: (username: string, password: string) => void;
//   submitted: boolean;
// }

// export type FormState<InputType extends string> = Record<InputType, string>

// export abstract class Form<InputType extends string, FormPropsType extends FormProps, FormStateType extends FormState<InputType>> extends Component<
//   FormPropsType,
//   FormStateType
// > {
//   constructor(props: FormPropsType) {
//     super(props);
//     this.state = this.get_initial_state();

//     this.handleInputChange = this.handleInputChange.bind(this);
//     this.on_submit = this.on_submit.bind(this);
//   }

//   private handleInputChange(event: ChangeEvent<HTMLInputElement>) {
//     const target = event.target;
//     const value = target.value;
//     const name = target.name;

//     if(this.is_input_type(name)) {
//       let input_Type = name as InputType
//       this.setState({ input_Type: value });
//     }
//   }

//   public render() {
//     return (
//       <form
//         className="Form"
//         onSubmit={(ev) => {
//           this.on_submit(ev);
//         }}
//       >
//         <h1 className="title">{this.title}</h1>
//         <input
//           name="username"
//           type={"text"}
//           value={this.state.username}
//           onChange={this.handleInputChange}
//           placeholder={"Username"}
//         />
//         <input
//           name="password"
//           type="password"
//           value={this.state.password}
//           onChange={this.handleInputChange}
//           placeholder={"Password"}
//         />
//         <input
//           type={"submit"}
//           value={this.props.submitted ? "Signing in..." : "Sign in"}
//           disabled={this.props.submitted}
//         />
//       </form>
//     );
//   }

//   private on_submit(ev: FormEvent) {
//     ev.preventDefault();
//     this.props.on_submit(this.state.username, this.state.password);
//   }

//   protected abstract readonly title: JSX.Element;
//   protected abstract get_initial_state(): FormStateType;
//   protected abstract get_inputs(): FormInputOptions[];
//   protected abstract is_input_type(str: string): str is InputType;
// }
