import React, { useContext } from "react";
import { Icon, Card, TextArea } from "semantic-ui-react";
import { FastField } from "formik";

import { PersonalInfoInput } from "../../graphql/apollo/types/globalTypes";
import SectionLabel from "../SectionLabel";
import RegularField from "../RegularField";
import PhotoField from "../PhotoField";
import { Section } from "../ResumeForm/resume-form";
import { emptyVal, uiTexts } from "./personal-info";
import { FormContext } from "../ResumeForm/resume-form";

interface Props {
  values: PersonalInfoInput | null | undefined;
  label: Section;
}

export function PersonalInfo(props: Props) {
  const { label } = props;
  // istanbul ignore next:
  const values = props.values || emptyVal;

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

function FirstColumn(props: { values: PersonalInfoInput }) {
  const { values } = props;
  const formContext = useContext(FormContext);

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
          onBlur={formContext.valueChanged}
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
          label={uiTexts.dateOfBirthLabel}
          component={RegularField}
          value={values.dateOfBirth}
        />
      </Card.Content>
    </Card>
  );
}

function makeName(suffix: keyof PersonalInfoInput) {
  return `personalInfo.${suffix}`;
}
