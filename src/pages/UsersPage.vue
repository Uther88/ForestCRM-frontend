<template>
  <q-page>
    <q-list separator link>
      <q-list-header v-if="$store.state.main.user.is_staff">
        <q-btn icon="add" color="positive" glossy label="Новый" @click.native="showNewUser = !showNewUser" />
      </q-list-header>
      <q-item  v-for="user in $store.state.main.users" :key="user.id" class="cursor-pointer">
        <q-item-side @click.native="viewUser(user)">
          <q-item-tile avatar>
            <img :src="user.avatar || 'statics/anon.png'" />
          </q-item-tile>
        </q-item-side>
        <q-item-main @click.native="viewUser(user)">
          <q-item-tile>{{ user.last_name }} {{ user.first_name }} {{ user.third_name}}</q-item-tile>
          <q-item-tile sublabel>{{user.position}}</q-item-tile>
        </q-item-main>
        <q-item-side class="group">
          <q-btn v-if="user.id == $store.state.main.user.id" icon="edit" color="primary" round @click.native="editUser(user)" />
          <q-btn v-else icon="message" round color="deep-orange" @click.native="$store.dispatch('main/showNewMessage', user.id)">
          </q-btn>
          <q-btn v-if="user.id != $store.state.main.user.id" icon="event_note" round color="green" @click.native="$router.push({name: 'newTask', params: {user: user.id}})">
          </q-btn>
        </q-item-side>
      </q-item>
        <q-modal
          v-if="selectedUser"
          v-model='showDetail'
          ref="userDetail"
          content-css="max-height:100%;"
          >
          <div class="flex column full-height justify-between bg-grey-4" style="min-width: 30vw;">
            <q-toolbar glossy>
              <q-toolbar-title class="text-center">Профиль сотрудника</q-toolbar-title>
            </q-toolbar>
            <div class="flex row justify-center">
              <div class="text-center q-pt-sm">
                <img :src="selectedUser.avatar || 'statics/anon.png'" class="shadow-3" style="width: 100%;
                  max-width: 220px; height: auto; border-radius: 8px;" />
              </div>
              <div class="shadow-1 q-pa-xs fit bg-white round-borders q-ma-sm">
                <table class="q-table user-info">
                  <tr>
                    <td>
                    Фамилия
                    </td>
                    <td>
                      {{selectedUser.last_name}}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Имя
                    </td>
                    <td>
                      {{selectedUser.first_name}}
                    </td>
                  </tr>
                  <tr>
                    <td>
                    Отчество
                    </td>
                    <td>
                      {{selectedUser.third_name}}
                    </td>
                  </tr>
                  <tr>
                    <td>
                    Должность
                    </td>
                    <td>
                      {{selectedUser.position}}
                    </td>
                  </tr>
                  <tr>
                    <td>
                    Email
                    </td>
                    <td>
                      {{selectedUser.email || 'Нет'}}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <q-toolbar class="justify-end" glossy>
              <q-btn label="Закрыть" icon="close" color="positive" @click.native="showDetail = !showDetail" />
            </q-toolbar>
          </div>
        </q-modal>
        <q-modal 
          v-model="showNewUser"
          @hide="resetForm"
          >
            <div class="flex column full-height  justify-between" style="min-width: 30vw;">
              <q-toolbar color="primary">
                <q-toolbar-title>Новый сотрудник</q-toolbar-title>
                <q-btn icon="close" flat v-close-overlay />
              </q-toolbar>
              <div class="flex column q-pa-sm">
                <q-field label="Логин:" icon="person" :icon-color="userForm.username ? 'positive' : 'faded'">
                  <q-input type="text" v-model.trim="userForm.username" />
                </q-field>
                <q-field label="Пароль:" icon="lock" :icon-color="userForm.password ? 'positive' : 'faded'">
                  <q-input type="password" v-model.trim="userForm.password" />
                </q-field>
                <q-field label="Фамилия:" icon="assignment" :icon-color="userForm.last_name ? 'positive' : 'faded'">
                  <q-input type="text" v-model.trim="userForm.last_name" />
                </q-field>
                <q-field label="Имя:" icon="assignment" :icon-color="userForm.first_name ? 'positive' : 'faded'">
                  <q-input type="text" v-model.trim="userForm.first_name" />
                </q-field>
                <q-field label="Отчество:" icon="assignment" :icon-color="userForm.third_name ? 'positive' : 'faded'">
                  <q-input type="text" v-model.trim="userForm.third_name" />
                </q-field>
                <q-field label="@mail:" icon="email" :icon-color="validateEmail() ? 'positive' : 'faded'">
                  <q-input type="email" v-model.trim="userForm.email" />
                </q-field>
                <q-field label="Должность:" icon="assignment_ind" :icon-color="userForm.position ? 'positive' : 'faded'">
                  <q-input type="text" v-model.trim="userForm.position" />
                </q-field>
                <q-field label="Аватар:" icon="image" :icon-color="userForm.avatar ? 'positive' : 'faded'">
                  <q-uploader
                     ref="fileField"
                     url=""
                     :hide-upload-button="true"
                     hide-underline
                     @add="files => {userForm.avatar = files[0]}"
                     @remove:cancel="userForm.avatar = null"
                     extensions='.gif,.jpg,.jpeg,.png'
                     auto-expand
                    />
                </q-field>
              </div>
              <q-toolbar class="justify-around self-end">
                <q-btn icon="save" color="positive" label="Сохранить" :disabled="!is_valid" @click.native="saveUser" />
                <q-btn icon="close" v-close-overlay color="negative" label="Отмена" />
              </q-toolbar>
            </div>
          </q-modal>
    </q-list>
  </q-page>
</template>

<script>
export default {
   name: 'UsersPage',
   data() {
     return {
       showDetail: false,
       showNewUser: false,
       selectedUser: null,
       editableUser: null,

       userForm: {
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        third_name: '',
        position: '',
        email: '',
        avatar: '',
       }
     }
   },
   methods: {
     // Reset form fields
      resetForm() {
        Object.keys(this.userForm).forEach(k => this.userForm[k] = '');
      },
      // Check for valid email input
      validateEmail() {
          var re = /\S+@\S+\.\S+/;
          return re.test(this.userForm.email);
        },
      // Open user view dialog
      viewUser(user) {
         this.selectedUser = user;
         this.showDetail = true;
       },
      // Open user edit dialog
       editUser(user) {
        this.editableUser = user;
        Object.keys(this.userForm).forEach(k => this.userForm[k] = user[k] || '')
        this.showNewUser = true;
       },
      // Save edited/new user
      saveUser() {
        if (this.is_valid) {
          const data = new FormData();
          Object.keys(this.userForm).forEach(k => data.set(k, this.userForm[k]));
          this.$axios({
            method: this.editableUser ? 'PUT' : 'POST',
            url: '/api/v1/users/',
            params: this.editableUser ? {pk: this.editableUser.id} : {}, 
            data: data
          })
          .then(response => {
            this.showNewUser = false;
            if (this.editableUser.id == this.$store.state.main.user.id) {
              this.$auth.logout();
            } else {
              this.$store.dispatch('main/fetchUsers', this);
            }
          }).catch(e => {
          })
        }
      }
    },
    computed: {
      // Form complete validation
      is_valid() {
        // Check for valid email complete
        if (this.userForm.email && !this.validateEmail()) {
          return false;
        }
        // Check for avatar and email complete
        if (Object.keys(this.userForm).filter(i => i != 'avatar' && i != 'email').every(val => this.userForm[val] != '' )) {
          return true;
        } 
      }
    },
}
</script>

<style>
  .user-info td {border: 1px solid lightgray; text-align: center;}
</style>
