class CreateDeliverableTemplates < ActiveRecord::Migration
  def change
    create_table :deliverable_templates do |t|
      t.string :format, limit: 30
      t.column :deadline, :interval
      t.string :title, limit: 30
      t.string :description
      t.references :event_template, index: true, foreign_key: true

      t.timestamps
    end
  end
end
