import { React, Component } from 'react';
import './Admin.css';

class MemoryForm extends Component {


    render() {
        console.log(this.props)
        return (
            <div className="sousForm">
                <label>Titre du souvenir <abbr> * </abbr></label>
                <input
                    required
                    className="require"
                    value={this.props.name}
                    type='text'
                    placeholder='Chute du mur'
                    onChange={(e) => this.props.onChange("name", e)}
                />
                <label>Description <abbr> * </abbr></label>
                <textarea required className="require" name="description" row="3" cols="33" placeholder='ex : mur de Berlin' maxlength="95" onChange={(e) => this.getValue("description", e)}></textarea>
                <label>Format du fichier <abbr> * </abbr></label>
                <select required className="require" name='format' id='format_id' onChange={(e) => this.props.onChange("format", e)}>
                    <option value='image'>Image</option>
                    <option value='video'>Vidéo</option>
                    <option value='youtube'>Lien Youtube</option>
                    <option value='texte'>Texte</option>
                </select>
                {
                    this.displayDoc(this.state.format)
                }
                <label>Date de contribution <abbr> * </abbr></label>
                <input required className="require" type='date' onChange={(e) => this.props.onChange("date", e)} />
                <label>Contributeurs (séparer les noms par des virgules) </label>
                <input
                    type='text'
                    placeholder='Jean Dupont'
                    onChange={(e) => this.getValue("contributeur", e)}
                />
                <label>Icone de souvenir </label>
                <select name='icons' id='icon_id' onChange={(e) => this.props.onChange("icon_id", e)}>
                    {this.props.icons.map((icon) => {
                        return (
                            <option key={icon.id} value={icon.id}>
                                {icon.name}
                            </option>
                        );
                    })}
                </select>
                <label>À quel souvenir est-il relié ? (peut être indépendant) </label>
                <select name='target' id='target_id' onChange={(e) => this.props.onChange("target_id", e)}>
                    {this.props.submemories.map((submemory) => {
                        return (
                            <option key={submemory.id} value={submemory.id}>
                                {submemory.name}
                            </option>
                        );
                    })}
                </select>
            </div>
        );
    }
}

export default MemoryForm;
