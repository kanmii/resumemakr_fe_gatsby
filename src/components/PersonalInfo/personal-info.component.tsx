import React from "react";
import { Icon, Card, TextArea } from "semantic-ui-react";
import { FastField } from "formik";
import { PersonalInfoInput } from "../../graphql/apollo-types/globalTypes";
import { SectionLabel } from "../SectionLabel";
import { RegularField } from "../RegularField";
import { PhotoField } from "../PhotoField/photo-field.component";
import { Section } from "../UpdateResumeForm/update-resume.utils";
import { emptyVal, uiTexts } from "./personal-info.utils";
import {
  domPrefix,
  domAddressInputId,
  domFirstNameInputId,
  domLastNameInputId,
  domProfessionInputId,
  domPhoneInputId,
  domEmailInputId,
  domDateOfBirthInputId,
} from "./personal-info.dom-selectors";

interface Props {
  values: PersonalInfoInput | null | undefined;
  label: Section;
}

export function PersonalInfo(props: Props) {
  const { label } = props;
  const values = props.values || emptyVal;

  return (
    <>
      <SectionLabel
        label={label}
        ico={<Icon name="user outline" />}
        data-testid="personal-info-section"
        id={domPrefix}
      />

      <BioData values={values} />

      <FirstColumn values={values} />
    </>
  );
}

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
              id={domFirstNameInputId}
            />

            <FastField
              id={domLastNameInputId}
              name={makeName("lastName")}
              label={uiTexts.lastNameLabel}
              component={RegularField}
              value={values.lastName}
            />
          </div>

          <FastField
            id={domProfessionInputId}
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
          id={domAddressInputId}
        />

        <FastField
          id={domPhoneInputId}
          name={makeName("phone")}
          label={uiTexts.phoneLabel}
          component={RegularField}
          value={values.phone}
        />

        <FastField
          id={domEmailInputId}
          name={makeName("email")}
          label={uiTexts.emailLabel}
          type="email"
          component={RegularField}
          value={values.email}
        />

        <FastField
          id={domDateOfBirthInputId}
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
