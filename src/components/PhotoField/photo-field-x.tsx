import React from "react";
import { FieldProps } from "formik";
import { Icon, Modal, Button } from "semantic-ui-react";

import "./styles.scss";
import { AppModal } from "../../styles/mixins";
import { toServerUrl } from "../utils";
import { FormContext } from "../ResumeForm/resume-form";

export interface Props extends FieldProps<{ photo: string | null }> {
  removeFilePreview?: () => void;
}
interface State {
  url?: string;
  fileState: FileState;
  open?: boolean;
}

enum FileState {
  previewing = "previewing",
  clean = "clean",
  touched = "touched",
  deleted = "deleted"
}

export class PhotoField extends React.Component<Props, State> {
  static contextType = FormContext;
  context!: React.ContextType<typeof FormContext>;

  state: State = {
    fileState: FileState.clean
  };

  /**
   * The value of the photo field path on the server
   */
  serverValue: string | null = null;

  constructor(props: Props) {
    super(props);
    this.serverValue = props.field.value;
  }

  componentDidMount() {
    const {
      field: { value }
    } = this.props;

    this.toUrl(value);
  }

  componentDidUpdate() {
    const {
      field: { value }
    } = this.props;

    if (value && this.serverValue !== value) {
      this.toUrl(value);
    }

    this.serverValue = value;
  }

  render() {
    const { fileState } = this.state;

    return (
      <>
        {(fileState === FileState.previewing ||
          fileState === FileState.touched) &&
          this.renderThumb()}

        {(fileState === FileState.clean || fileState === FileState.deleted) && (
          <div className="components-photo-field file-chooser">
            <div className="upload-photo-icon-wrapper">
              <Icon name="camera" />
            </div>

            {this.renderFileInput("Upload Photo")}
          </div>
        )}

        {this.renderModal()}
      </>
    );
  }

  renderThumb = () => {
    const { fileState, url } = this.state;

    if (!url) {
      return null;
    }

    return (
      <div
        className="components-photo-field thumb"
        data-testid="photo-preview"
        onClick={this.touch}
        onMouseLeave={this.unTouch}
        onMouseEnter={this.touch}
        style={{
          backgroundImage: url
        }}
      >
        {fileState === FileState.touched && (
          <div className="editor-container" data-testid="edit-btns">
            {this.renderFileInput("Change photo")}

            <label
              className="change-photo"
              onClick={evt => {
                evt.stopPropagation();
                this.setState({ open: true });
              }}
            >
              <Icon name="delete" /> Remove
            </label>
          </div>
        )}
      </div>
    );
  };

  private renderFileInput = (label: string) => {
    const {
      field: { name: fieldName }
    } = this.props;

    return (
      <>
        <label className="change-photo" htmlFor={fieldName}>
          <Icon name="upload" /> {label}
        </label>

        <input
          type="file"
          accept="image/*"
          className="input-file"
          name={fieldName}
          id={fieldName}
          onChange={this.handleFileUpload}
        />
      </>
    );
  };

  private renderModal = () => {
    return (
      <AppModal open={this.state.open}>
        <Modal.Header>Removing photo</Modal.Header>

        <Modal.Content>
          <Modal.Description>
            <div>Do you really want to remove photo?</div>
          </Modal.Description>
        </Modal.Content>

        <Modal.Actions>
          <Button
            positive={true}
            icon="remove"
            labelPosition="right"
            content="No"
            onClick={() => {
              this.setState({ open: false });
            }}
          />

          <Button
            negative={true}
            icon="checkmark"
            labelPosition="right"
            content="Yes"
            onClick={this.onDelete}
          />
        </Modal.Actions>
      </AppModal>
    );
  };

  private touch = () => {
    this.setState({ fileState: FileState.touched });
  };

  private unTouch = () => {
    this.setState({ fileState: FileState.previewing });
  };

  private handleFileUpload = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    const file = (evt.currentTarget.files || [])[0];

    if (!file) {
      return;
    }

    this.toUrl(file);
  };

  private toUrl = (file: File | null | string) => {
    if (!file) {
      return;
    }

    /**
     * The file may either be a path string from server or base64 encoded
     * string from client file
     */
    if ("string" === typeof file) {
      this.setState({
        url: `url(${toServerUrl(file)})`,
        fileState: FileState.previewing
      });
      return;
    }

    /**
     * If we are selecting using browser file picker, then we get a File
     * instance
     */
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Encoded = reader.result as string;
      this.valueChanged(base64Encoded);

      this.setState({
        url: `url(${base64Encoded})`,
        fileState: FileState.previewing
      });
    };

    reader.readAsDataURL(file);
  };

  private onDelete = () => {
    this.setState({
      fileState: FileState.deleted,
      url: undefined,
      open: false
    });
    this.valueChanged(null);
  };

  private valueChanged = (file: string | null) => {
    this.props.form.setFieldValue(this.props.field.name, file);
    this.context.valueChanged();
  };
}

export default PhotoField;
