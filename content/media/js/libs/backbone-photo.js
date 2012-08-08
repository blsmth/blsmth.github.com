
// make sure we have a dispatcher available
if (_.isUndefined(window.dispatcher)) {
  window.dispatcher = {};
  _.extend(window.dispatcher, Backbone.Events);
}



    var Photo = Backbone.Model.extend({
          defaults: {
            filename: '',
            title: '',
            description: '',
            state: ''
          },
          select: function(state){
          this.set({'state': state ? 'selected' : ''});
          }
        });

        var Photos = Backbone.Collection.extend({
          model: Photo,


          select: function(model){
            if( this.selectedThumb() ){

              this.selectedThumb().select(false);
            }
            this.selected = model;
            this.selected.select(true);

          },
          selectedThumb: function(){
            return this.selected;
          }
        });





        var FullView = Backbone.View.extend({
          template: _.template($('#fullsize-template').html()),

          initialize: function(){
            _.bindAll(this);
            dispatcher.on('thumb:selected', this.selectphoto);
          },

          selectphoto: function(photo){
            this.model = photo;
            this.render();
            console.log('selectphoto');
          },

          render: function(){
            this.$el.html(this.template(this.model.toJSON()));
          }
        });




        var ThumbView = Backbone.View.extend({
          tagName: 'li',
          template: _.template('<img src="<%= thumb_path %>" class="<%= state %>" />'),
          events: {
            "click" : "selectThumb"
          },
          initialize: function(options){
            _.bindAll(this);

          },
          render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
          },
          selectThumb: function(){

            dispatcher.trigger('thumb:selected', this.model);
          }
        });

        var GalleryView = Backbone.View.extend({
          el: $("#gallery"),
          template: _.template($('#gallery-template').html()),
          initialize: function(options) {
            _.bindAll(this);

            this.gallery = this.options.gallery;
            this.collection = new Photos();
            this.render();


            this.fullsize = new FullView({ el: this.$('#fullsize') });
            this.thumbs = this.$el.find('#thumbs');


            this.load();

          },

          load: function() {

            self = this;
            id = 1;
            _.each(this.gallery.photos, function(p){
              p.full_path = self.gallery.directory + p.filename;
              p.thumb_path =  self.gallery.directory + 'thumbs/' + p.filename;
              p.id = id;
              photo = new Photo(p);
              self.collection.add(photo);

              $(this.thumbs).append( new ThumbView({
                model: photo }).render().el);
              id += 1;
            });

           dispatcher.trigger('thumb:selected', this.collection.get(1));

          },

          render: function(){
            this.$el.html(this.template({
                title: this.gallery.title,
                description: this.gallery.description
            }));
            return this.el;

          }
        });



gallery = {
    title: 'Lucas',
    description: "This gallery so far is my playing around with creating an image gallery with \
    Backbone.js.  I wanted to put an image gallery on this site to show off of some photos I have \
    laying around, but didn't want to mess with pre-canned solutions so I started writing one of my own. \
    Once it's finished I'll release the code on my github.com account.",
    directory: '/media/photos/lucas/',
      photos: [
          { filename: 'IMG_4423.jpg', title: 'Oh hai!' },
          { filename: 'IMG_4433.jpg', title: 'Friends' },
          { filename: 'IMG_4505.jpg', title: 'Sleeping with Sock Monkey' },
          { filename: 'IMG_4369.jpg', title: 'Weeeeee' },
          { filename: 'IMG_4333.jpg', title: 'First burrito' }
          ]
  };



        window.Gallery =  new GalleryView({ gallery: gallery});
