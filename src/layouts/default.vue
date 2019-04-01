<template>
  <q-layout view="hHh LpR lFf">
    <q-layout-header class="print-hide">
      <q-toolbar color="dark" class="q-py-sm" glossy>
        <q-btn
          fab
          color="green"
          glossy icon="fas fa-tree"
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
        </q-btn>
        <q-toolbar-title style="font-size: 1em">
          {{ $store.state.main.app_name }}
          <div slot="subtitle" class="group">
            Версия: {{ $store.state.main.version }}
            <q-icon v-if="$store.state.main.connected" name="fas fa-globe" color="positive" title="Онлайн" />
            <q-icon v-else name="fas fa-globe" color="negative" title="Офлайн" />
          </div>
        </q-toolbar-title>
            <div class="group">
              <q-btn 
              	round
              	color="indigo"
              	size=""
              	icon="fas fa-file"
              	title="Документы"
              	glossy
              	@click.native="docsDialog = true"
              />
              <q-btn 
              icon="mail" 
              round 
              color="deep-orange" 
              class="relative-position" 
              glossy 
              @click.native="$router.push('/messages/')"
              title="Сообщения"
              >
                <q-chip v-if="new_messages" color="red" class="absolute-bottom-right" style="bottom:-5px;" small>
                  {{ new_messages }}
                </q-chip>
              </q-btn>
                <q-btn 
                icon="event_note" 
                round 
                color="green" 
                glossy 
                @click.native="$router.push('/tasks/view/inbox')"
                title="Задачи"
                >
                    <q-chip v-if="new_tasks" color="red" class="absolute-bottom-right" style="bottom:-5px;" small>
                      {{ new_tasks }}
                    </q-chip>
                </q-btn>
            </div>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      overlay
      class="print-hide"
      > 
      <q-list link sparse no-border separator class="no-padding ">
            <q-item class="shadow-1">
              <q-item-side avatar>
                <img :src="$user.avatar" class="avatar" />
              </q-item-side>
              <q-item-main>
                <q-item-tile>
                  {{ $user.first_name }}
                  {{ $user.last_name }}
                </q-item-tile>
                <q-item-tile sublabel>{{ $user.position }}</q-item-tile>            
              </q-item-main>
            </q-item>
            <q-item  @click.native="$router.push('/tasks')">
                <q-item-side icon="event_note"  color="secondary" />
                <q-item-main label="Задачи" />
               <q-item-side label>
                     <q-chip v-if="new_tasks" color="positive" small>{{ new_tasks }}</q-chip>
                </q-item-side>
            </q-item>
            <q-item @click.native="$router.push('/messages')">
                 <q-item-side icon="mail" color="secondary" />
                <q-item-main label="Сообщения" />
                <q-item-side label>
                     <q-chip v-if="new_messages" color="positive" small>{{ new_messages }}</q-chip>
                </q-item-side>
            </q-item>
            <q-item @click.native="docsDialog = !docsDialog">
                <q-item-side icon="assignment" color="secondary" />
                <q-item-main label="Документы" />
                <q-modal v-model="docsDialog" >
                  <q-toolbar color="tertiary" glossy>
                    <q-toolbar-title>
                      Документы
                    </q-toolbar-title>
                    <q-btn flat round dense icon="close" @click.native="docsDialog = !docsDialog" />
                  </q-toolbar>
                  <q-list link separator sparse>
                    <q-item @click.native="$router.push({name: 'WaybillList'})">
                      <q-item-side icon='directions_car' color="primary" />
                      <q-item-main label="Путевые листы"/>
                    </q-item>
                    <q-item @click.native="$router.push({name: 'OutfitList'})">
                      <q-item-side icon='fas fa-people-carry' color="primary" />
                      <q-item-main label="Наряды-акты"/>
                    </q-item>
                    <q-item @click.native="$router.push({name: 'TractorRegFormList'})">
                      <q-item-side icon='fas fa-tractor' color="primary" />
                      <q-item-main label="Учетные листы тракториста"/>
                    </q-item>
                    <q-item @click.native="reports_popover = !reports_popover">
                        <q-item-side icon='fas fa-clipboard-list' color="primary" />
                        <q-item-main label="Ведомости"/>
                        <q-popover v-model="reports_popover">
                          <q-list separator link>
                            <q-item @click.native="$router.push({name: 'SvodnayaVedomost'})">
                              <q-item-side icon='fas fa-money-bill' color="primary" />
                              <q-item-main label="Сводные ведомости"/>
                            </q-item>
                            <q-item @click.native="$router.push({name: 'NakopitelnayaVedomost'})">
                              <q-item-side icon='fas fa-ruble-sign' color="primary" />
                              <q-item-main label="Накопительные ведомости"/>
                            </q-item>
                            <q-item @click.native="$router.push({name: 'WorkTimeTable'})">
                              <q-item-side icon='watch_later' color="primary" />
                              <q-item-main label="Табеля учёта рабочего времени"/>
                            </q-item>
                          </q-list>
                        </q-popover>
                        <q-item-side icon="arrow_drop_down" color="primary" />
                      </q-item>
                      <q-item @click.native="material_popover = !material_popover">
                        <q-item-side icon='category' color="primary" />
                        <q-item-main label="Материальные отчеты"/>
                        <q-popover v-model="material_popover">
                          <q-list separator link>
                            <q-item @click.native="$router.push({name: 'ForestArrivalReports'})">
                              <q-item-side icon='fas fa-tree' color="primary" />
                              <q-item-main label="Акты прихода лесопродукции"/>
                            </q-item>
                            <q-item @click.native="$router.push({name: 'RecyclingList'})">
                              <q-item-side icon='fas fa-recycle' color="primary" />
                              <q-item-main label="Ведомости переработки"/>
                            </q-item>
                            <q-item @click.native="$router.push({name: 'HandoutList'})">
                              <q-item-side icon='fas fa-gas-pump' color="primary" />
                              <q-item-main label="Раздаточные ведомости"/>
                            </q-item>
                            <q-item @click.native="$router.push({name: 'FuelDistributionList'})">
                              <q-item-side icon='fas fa-oil-can' color="primary" />
                              <q-item-main label="Распределение ГСМ"/>
                            </q-item>
                            <q-item @click.native="$router.push({name: 'ActSpisanyaList'})">
                              <q-item-side icon='fas fa-trash' color="primary" />
                              <q-item-main label="Акты списания материальных запасов"/>
                            </q-item>
                          </q-list>
                        </q-popover>
                        <q-item-side icon="arrow_drop_down" color="primary" />
                      </q-item>
                  </q-list>
                </q-modal>
            </q-item>
            <q-item  @click.native="$router.push('/users')">
                <q-item-side icon="account circle" color="secondary" />
                <q-item-main label="Сотрудники" />
            </q-item>
            <q-item @click.native="bugReport">
                <q-item-side icon="bug_report" color="secondary" />
                <q-item-main label="Сообщить об ошибке" />
            </q-item>
            <q-item @click.native="logout()">
                <q-item-side icon="reply" color="secondary" />
                <q-item-main label="Выход" />
            </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container class="window-height">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
    import { openURL } from 'quasar'

export default {
  name: 'LayoutDefault',
  data () {
    return {
      leftDrawerOpen: false,
      reports_popover: false,
      material_popover: false,
      docsDialog: false,
      new_messages: 0,
      new_tasks: 0,
    }
  },

  methods: {
      // Send bug-report
      bugReport() {
        this.$q.dialog({
          message: 'Сообщить об ошибке',
          color: 'primary',
          ok: {label: 'Отправить', color: 'green'},
          cancel: true, preventClose: true,
          prompt: {
            type: 'textarea',
          }
        }).then(report => {
          if (report) {
            var data = {reporter: '/api/v1/users/' + this.$user.username + '/', text: report};
            this.$axios.post('/api/v1/bug-reports/', data)
            .then(response => {
              this.$q.notify({message:'Отчет отправлен!', color: 'positive'})
            }).catch(e => {
              this.$q.notify({message: e, color: 'negative'})
            })
          }
        }).catch( () => {})
      },
      // Checker for new tasks
      checkNewTasks() {
        var params = { viewed: false, performer: this.$user.id };
        this.$axios.get('/api/v1/task/', {params})
        .then(response => {
          this.$store.commit('main/setStatus', true);
          this.new_tasks = response.data.meta.total_count;
        }).catch(e => {
          if (this.$store.state.main.connected) {
              this.$store.commit('main/setStatus', false);
            }
        })
      },
      // Checker for new messages
      checkNewMessages() {
       var params = { is_new: true, recipient: this.$user.id };
        this.$axios.get(
          '/api/v1/messages/', { params }
        ).then(response => {
          this.$store.commit('main/setStatus', true);
          this.new_messages = response.data.meta.total_count;
        }).catch(e => {
          this.$store.commit('main/setStatus', false);
        })
      },
      // Play sound on new message/task
      playSound(name) {
        var audio = new Audio('statics/sounds/' + name);
        audio.play();
      },
      openURL,
      // Logout from system
      logout() {
    		this.$auth.logout(this);
    	},
  },
  created: function() {
      // Set api auth key to headers, set user acount and fetch users to store
      this.$axios.defaults.headers.common["Authorization"] = "ApiKey " + this.$user.username + ":" + this.$user.api_key;
      this.$store.dispatch('main/setAccount');
      this.$store.dispatch('main/fetchUsers', this);
      this.$store.dispatch('main/fetchUnits', this);
      // Set checkers for messages and tasks
      this.newMessagesCheker = setInterval(this.checkNewMessages, 1000 * 10);
      this.newTasksCheker = setInterval(this.checkNewTasks, 1000 * 20);
      // Open drawer menu on Ctrl + m key press
      document.onkeydown = (ev) => {
        if (ev.keyCode == 77 && ev.ctrlKey) {
          this.leftDrawerOpen = !this.leftDrawerOpen;
        }
      }
  },
  destroyed: function() {
    // Clear messages and tasks checkers on destroy
    clearInterval(this.newMessagesCheker);
    clearInterval(this.newTasksCheker);
  },
  watch: {
    // On new messages - play sound
    'new_messages': function(nv, ov) {
      if (nv > ov) {
        this.playSound('new_message.mp3')
      }
    },
    // On new tasks - play sound
    'new_tasks': function(nv, ov) {
      if (nv > ov) {
        this.playSound('new_message.mp3')
      }
    },
  }

}
</script>
