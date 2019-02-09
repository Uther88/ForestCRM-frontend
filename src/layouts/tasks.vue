<template>
  <q-page>
    <q-tabs align="center" color="indigo" glossy style="border-radius: 0;">
        <q-route-tab to="/tasks/" exact slot="title" icon="poll" label="Инфо"/>
        <q-route-tab to="/tasks/view/inbox" exact slot="title" icon="archive" label="Входящие"/>
        <q-route-tab to="/tasks/view/outbox" exact slot="title" icon="unarchive" label="Исходящие"/>
        <q-route-tab to="/tasks/create" exact slot="title" icon="add box" label="Новое" />
    </q-tabs>
    <router-view />
  </q-page>
</template>

<script>
export default {
  name: 'TasksLayout',
}
</script>
