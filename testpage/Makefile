PARCEL=node_modules/.bin/parcel
LOCAL_TPW_JS=tabpanelwidget.vue.js

default: $(LOCAL_TPW_JS)
	$(PARCEL) --port 1237 index.pug

build: $(LOCAL_TPW_JS)
	$(PARCEL) build index.pug

# this is because parcel duplicates vue dep in parent dir and causes issues
# cannot get it to resolve the import vue in tpw.vue.js to the vue in this node_modules...
$(LOCAL_TPW_JS): ../src/tabpanelwidget.vue.js
	cp $< $@
