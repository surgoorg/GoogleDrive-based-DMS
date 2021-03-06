var React = require('react');
var FileStore = require('./FileStore');
var FileActions = require('./FileActions');
var ListItemComponent = require('./ListItemComponent.jsx');
var $ = require('zepto-browserify').$;
var If = require('./If.jsx');
var NProgress = require('nprogress');

var classes = "list"

var ListComponent = React.createClass({
    getInitialState: function() {
        FileStore.init();
        return {
            files: '',
            layout: 'list'
        };
    },
    componentDidMount: function() {
        this.unsubscribe = FileStore.listen(this.filesUpdated);
        $('.pagination-prev').attr('disabled', 'true');
    },
    componentWillUnmount: function() {
        this.unsubscribe();
    },
    showList: function() {
        this.setState({layout: 'list'});
    },
    showThumbnail: function() {
        this.setState({layout: 'thumbnail'});
    },
    filesUpdated: function(newFiles, newTerms, hasPagination, isFirstPage) {
        this.setState({
            files: newFiles,
            terms: newTerms
        });

        // Pagination stuffs
        if(isFirstPage && hasPagination) {
            $('.pagination-prev').attr('disabled', 'true');
            $('.pagination-next').removeAttr('disabled');
        } else if(isFirstPage) {
            $('.pagination-btn').attr('disabled', 'true');
        } else if(hasPagination) {
            $('.pagination-btn').removeAttr('disabled');
        } else if(!hasPagination) {
            $('.pagination-next').attr('disabled', 'true');
            $('.pagination-prev').removeAttr('disabled');
        }
    },
    handlePrev: function() {
        FileActions.getPrev();
        $('.pagination-btn').attr("disabled", "true");
    },
    handleNext: function() {
        FileActions.getNext();
        $('.pagination-btn').attr("disabled", "true");
    },
    render: function() {
        if (this.state.files) {
            NProgress.done();
            $('.content').scrollTop(0);
            return (
                <div>
                    <h1 className="title-1">Tous les fichiers</h1>
                    <p className="instruction">Vous trouverez ici la liste de tous les fichiers. Utiliser la barre de recherche ci-dessus afin de rechercher un fichier.</p>
                    <aside className="files-button">
                        <button className="files-button-list" onClick={this.showList}></button>
                        <button className="files-button-thumbnail" onClick={this.showThumbnail}></button>
                    </aside>
                    <If test={this.state.terms}>
                        <h2 className="title-2">Résultats de votre recherche pour le(s) mot(s) : {this.state.terms}</h2>
                    </If>
                    <ListItemComponent data={this.state.files} terms={this.state.terms} layout={this.state.layout} />
                    <div>
                        <button className="pagination-btn pagination-prev" onClick={this.handlePrev}>Précédent</button>
                        <button className="pagination-btn pagination-next" onClick={this.handleNext}>Suivant</button>
                    </div>
                </div>
            );
        } else {
          return <div>Chargement de la liste des fichiers...</div>;
        }
    }
});

module.exports = ListComponent;