;(function (){
  'user strict';

var Event = new Vue();

var alert_sound = document.getElementById('alert-sound');

Vue.component('task',{
  template: '#task-tpl',
  props: ['todo','css_complete'],
  methods: {
    action: function(name, params) {
      Event.$emit(name, params);
    }
  },
});

function copy(obj) {
  return Object.assign({}, obj);
};

  new Vue({
    el: '#main',
    data: {
      list: [],
      last_id: 0,
      current: {},
    },

    mounted: function () {
      var me = this;
      this.list = ms.get('list') || this.list;
      this.last_id = ms.get('last_id') || this.last_id;

      setInterval(function () {
        me.check_alerts();
      }, 1000);

      Event.$on('remove', function(id) {
        if (id) {
          me.remove(id);
        }
        //console.log('params:', params);
      });

      Event.$on('toggle_complete', function(id) {
        if (id) {
          me.toggle_complete(id);
        }
        //console.log('params:', params);
      });

      Event.$on('set_current', function(id) {
        if (id) {
          me.set_current(id);
        }
        //console.log('params:', params);
      });

      Event.$on('toggle_detail', function(id) {
        if (id) {
          me.toggle_detail(id);
        }
        //console.log('params:', params);
      });


    },

    methods: {
      check_alerts: function (){
        var me = this;
        this.list.forEach(function (row, i) {
          var alert_at = row.alert_at;
          if(!alert_at || row.alert_confirmed) return;

          var alert_at = (new Date(alert_at)).getTime();
          var now = (new Date()).getTime();
          if (now >= alert_at) {
            alert_sound.play();
            var confirmed = confirm(row.title);
            Vue.set(me.list[i], 'alert_confirmed', confirmed);
          }
        });
      },

      merge: function () {
        var is_update, id;
        is_update = id = this.current.id;
        if (is_update) {
          var index = this.find_index(id);
          //console.log(index);
          Vue.set(this.list, index, copy(this.current));
        } else {
          var title = this.current.title;
          if (!title && title !== 0) return;

          var todo = copy(this.current);
          //last_id自增,相当于数据库中的id关键字
          this.last_id ++;
          ms.set('last_id', this.last_id);
          todo.id = this.last_id;
          this.list.push(todo);
        }
        //ms.set('lsit', this.list);
        this.set_current({});
      },

      toggle_detail: function (id) {
        var index = this.find_index(id);
        Vue.set(this.list[index], 'show_detail', !this.list[index].show_detail)
      },

      remove: function (id) {
        var index = this.find_index(id);
        //console.log(index);
        this.list.splice(index, 1);
        //ms.set('lsit', this.list);
      },

      next_id: function () {
        return this.list.length + 1;
      },

      set_current: function (todo){
        this.current = copy(todo);
      },

      reset_current: function (){
        this.set_current({});
      },

      find_index: function (id) {
        return this.list.findIndex(function(item) {
          return item.id == id;
        })
      },

      toggle_complete: function (id) {
        var i = this.find_index(id);
        Vue.set(this.list[i], 'completed', !this.list[i].completed);
      },

    },
    watch: {
      list: {
        deep: true,
        handler: function (n, o) {
          if (n) {
            ms.set('list', n);
          } else {
            ms.set('list', []);
          }
        }
      }
    }
  });

})();
