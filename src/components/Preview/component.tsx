import React from "react";
import { Icon } from "semantic-ui-react";

import "./styles.scss";
import {
  GetResume_getResume_personalInfo,
  GetResume_getResume_skills,
  GetResume_getResume_education,
  GetResume_getResume_additionalSkills,
  GetResume_getResume_languages
} from "../../graphql/apollo/types/GetResume";
import { CreateExperienceInput } from "../../graphql/apollo/types/globalTypes";
import { Props, Mode } from "./utils";
import { toServerUrl } from "../utils";

export class Preview extends React.Component<Props> {
  containerRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    if (this.props.mode === Mode.download) {
      require("./override-globals.scss");
    }
  }

  componentDidUpdate() {
    const els = document.querySelectorAll(".right .break-here");

    if (!els.length) {
      return;
    }

    const { mode } = this.props;
    let sumHeight = 0;
    let totalHeight = 0;
    const maxHeights = {
      [Mode.download]: 850,
      [Mode.preview]: 1000
    };

    [].forEach.call(els, (el: HTMLElement, index: number) => {
      const h = getHeight(el);
      sumHeight += h;
      totalHeight += h;

      if (sumHeight >= maxHeights[mode]) {
        const id = "page-break" + index;

        if (!document.getElementById(id)) {
          const pageBreak = document.createElement("div");
          pageBreak.id = id;

          const classNames = ["html2pdf__page-break"];
          if (mode === Mode.preview) {
            classNames.push("preview");
          }

          pageBreak.classList.add(...classNames);
          el.before(pageBreak);
        }

        sumHeight = 0;
      }
    });

    const { current } = this.containerRef;

    if (mode === Mode.download && current) {
      current.style.height = 1120 * Math.ceil(totalHeight / 900) + "px";
    }
  }

  render() {
    const { getResume, loading, error } = this.props;

    if (loading) {
      return <div>loading</div>;
    }

    if (error) {
      return <div>{JSON.stringify(error)}</div>;
    }

    if (!getResume) {
      return <div>An error occurred</div>;
    }

    const { skills, experiences, education, personalInfo } = getResume;

    const { mode } = this.props;

    const additionalSkills = (getResume.additionalSkills || []).filter(
      a => a && a.description && a.description.trim()
    ) as GetResume_getResume_additionalSkills[];

    const languages = (getResume.languages || []).filter(
      a => a && a.description && a.description.trim()
    ) as GetResume_getResume_languages[];

    const hobbies = (getResume.hobbies || []).filter(s => s && s.trim());

    return (
      <div
        className={`components-preview ${
          mode === Mode.download ? "download" : ""
        }`}
        ref={this.containerRef}
        data-testid="preview-resume-section"
      >
        <div className="main-column left">
          {personalInfo && <PersonalInfo personalInfo={personalInfo} />}

          {additionalSkills && !!additionalSkills.length && (
            <div className="section-container">
              <h3 className="break-here section-title left">
                Additional Skills
              </h3>

              {additionalSkills.map((s, index) => {
                const { description, level } = s;

                if (!description) {
                  return null;
                }

                return (
                  <div key={index} className="break-here has-level">
                    {description} {level && `[${level}]`}
                  </div>
                );
              })}
            </div>
          )}

          {languages && !!languages.length && (
            <div className="section-container">
              <h3 className="break-here section-title left">Languages</h3>

              {languages.map((s, index) => {
                const { description, level } = s;

                return (
                  <div key={index} className="break-here has-level">
                    {description} {level && `[${level}]`}
                  </div>
                );
              })}
            </div>
          )}

          {hobbies && !!hobbies.length && (
            <div className="section-container">
              <h3 className="break-here section-title left">Hobbies</h3>

              {hobbies.map((s, index) => (
                <div key={index} className="break-here  has-level">
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="main-column right">
          {skills && <Skills skills={skills as GetResume_getResume_skills[]} />}

          {experiences && !!experiences.length && (
            <Experiences experiences={experiences as CreateExperienceInput[]} />
          )}

          {education && !!education.length && (
            <Educations
              educations={education as GetResume_getResume_education[]}
            />
          )}
        </div>
      </div>
    );
  }
}

function PersonalInfo({
  personalInfo
}: {
  personalInfo: GetResume_getResume_personalInfo;
}) {
  const {
    firstName,
    lastName,
    profession,
    address,
    phone,
    email,
    dateOfBirth,
    photo
  } = personalInfo;

  return (
    <>
      <div className="section-container">
        <h1 className="names-container">
          <span className="name">{firstName}</span>
          <span className="name">{lastName}</span>
        </h1>

        <div className="profession">{profession}</div>
      </div>

      <div className="section-container">
        <h3 className="section-title left">Personal Info</h3>

        {dateOfBirth && (
          <h4 className="personal-info">
            <Icon name="birthday" />

            <p>{dateOfBirth}</p>
          </h4>
        )}

        <h4 className="personal-info">
          <Icon name="map marker alternate" />

          {address &&
            address
              .split("\n")
              .map((addy, index) => <p key={index}>{addy.trim()}</p>)}
        </h4>

        <h4 className="personal-info">
          <Icon name="phone" />

          <p>{phone}</p>
        </h4>

        <h4 className="personal-info">
          <Icon name="mail" />

          <p>{email}</p>
        </h4>
      </div>

      {photo && (
        <div
          className="photo"
          data-testid={`${firstName} ${lastName} photo`}
          style={{
            backgroundImage: `url(${toServerUrl(photo)})`
          }}
        />
      )}
    </>
  );
}

function Educations({
  educations
}: {
  educations: GetResume_getResume_education[];
}) {
  return (
    <div className="section-container">
      <h3 className="break-here section-title right">Education</h3>

      {educations.map(ed => {
        const { course, school, fromDate, toDate, id, achievements } = ed;
        return (
          <div key={id} className="experience-container">
            <div className="section-sub-head break-here">
              <div className="description">{course}</div>

              <div>
                {fromDate}
                <span className="to-arrow">&rarr;</span>
                {`${toDate || "present"}`}
              </div>
            </div>

            <div className="company break-here">{school}</div>

            <Achievements achievements={achievements} />
          </div>
        );
      })}
    </div>
  );
}

function Experiences({
  experiences
}: {
  experiences: CreateExperienceInput[];
}) {
  return (
    <div className="section-container">
      <h3 className="break-here section-title right">Experience</h3>

      {experiences.map((exp, index) => {
        const { position, fromDate, toDate, companyName, achievements } = exp;

        return (
          <div key={index} className="experience-container">
            <div className="section-sub-head break-here">
              <div className="description">{position}</div>

              <div>
                <span>{fromDate}</span>
                <span className="to-arrow">&rarr;</span>
                <span>{`${toDate || "present"}`}</span>
              </div>
            </div>

            <div className="company break-here">{companyName}</div>

            <Achievements achievements={achievements} />
          </div>
        );
      })}
    </div>
  );
}

function Skills({ skills }: { skills: GetResume_getResume_skills[] }) {
  return (
    <div className="section-container">
      <h3 className="break-here section-title right skills">Skills</h3>

      {skills.map(skill => {
        const { description, achievements } = skill;

        if (!description) {
          return null;
        }

        return (
          <React.Fragment key={description}>
            <div className="description break-here">{description}</div>

            <Achievements achievements={achievements} />
          </React.Fragment>
        );
      })}
    </div>
  );
}

let elmKey = 0;

function Achievements({
  achievements
}: {
  achievements: Array<string | null> | null | undefined;
}) {
  achievements = (achievements || []).filter(a => !!a);

  if (!achievements.length) {
    return null;
  }

  return (
    <ul>
      {achievements.map(achievement => {
        return (
          <li key={(elmKey++).toString()} className="break-here achievement">
            {achievement}
          </li>
        );
      })}
    </ul>
  );
}

function getHeight(el: HTMLElement) {
  const styles = window.getComputedStyle(el);
  return (
    parseFloat(styles.getPropertyValue("margin-top").replace("px", "")) +
    parseFloat(styles.getPropertyValue("margin-bottom").replace("px", "")) +
    el.offsetHeight
  );
}
