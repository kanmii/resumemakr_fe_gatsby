import React from "react";
import { Icon, Card, TextArea } from "semantic-ui-react";
import { FastField } from "formik";

import { PersonalInfoInput } from "../../graphql/apollo/types/globalTypes";
import SectionLabel from "../SectionLabel";
import RegularField from "../RegularField";
import PhotoField from "../PhotoField";
import { Section } from "../ResumeForm/resume-form";
import { emptyVal, uiTexts } from "./personal-info";
import { FormContext } from "../ResumeForm/resume-form";

class FirstColumn extends React.Component<{ values: PersonalInfoInput }> {
  static contextType = FormContext;
  context!: React.ContextType<typeof FormContext>;

  render() {
    const { values } = this.props;

    return (
      <Card>
        <Card.Content>
          <Card.Header>1st column</Card.Header>
        </Card.Content>

        <Card.Content>
          <FastField
            name={makeName("address")}
            label={uiTexts.addressLabel}
            comp={TextArea}
            component={RegularField}
            value={values.address}
            onBlur={this.context.valueChanged}
          />

          <FastField
            name={makeName("phone")}
            label={uiTexts.phoneLabel}
            component={RegularField}
            value={values.phone}
          />

          <FastField
            name={makeName("email")}
            label={uiTexts.emailLabel}
            type="email"
            component={RegularField}
            value={values.email}
          />

          <FastField
            name={makeName("dateOfBirth")}
            label="Date of birth yyyy-mm-dd"
            component={RegularField}
            value={values.dateOfBirth}
          />
        </Card.Content>
      </Card>
    );
  }
}

interface Props {
  values: PersonalInfoInput | null | undefined;
  label: Section;
}

// tslint:disable-next-line:max-classes-per-file
export class PersonalInfo extends React.Component<Props, {}> {
  render() {
    const { label } = this.props;
    let values = this.props.values;

    if (!values) {
      values = emptyVal;
    }

    return (
      <>
        <SectionLabel
          label={label}
          ico={<Icon name="user outline" />}
          data-testid="personal-info-section"
        />

        <BioData values={values} />

        <FirstColumn values={values} />
      </>
    );
  }
}

export default PersonalInfo;

function BioData({ values }: { values: PersonalInfoInput }) {
  return (
    <>
      <Card>
        <Card.Content>
          <div className="names">
            <FastField
              name={makeName("firstName")}
              label={uiTexts.firstNameLabel}
              component={RegularField}
              value={values.firstName}
            />

            <FastField
              name={makeName("lastName")}
              label={uiTexts.lastNameLabel}
              component={RegularField}
              value={values.lastName}
            />
          </div>

          <FastField
            name={makeName("profession")}
            label={uiTexts.professionLabel}
            component={RegularField}
            value={values.profession}
          />
        </Card.Content>
      </Card>

      <FastField
        name={makeName("photo")}
        component={PhotoField}
        value={values.photo}
      />
    </>
  );
}

function makeName(suffix: keyof PersonalInfoInput) {
  return `personalInfo.${suffix}`;
}
