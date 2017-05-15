class Initial < ActiveRecord::Migration[5.0]
  def change
    create_table :arguments do |t|
      t.string :name
      t.timestamps
    end
    create_table :premises do |t|
      t.belongs_to :argument, index: true, foreign_key: true
      t.string :name
      t.timestamps
    end
    create_table :sources do |t|
      t.string :name
      t.timestamps
    end
    create_table :premise_sources do |t|
      t.belongs_to :premise, index: true
      t.belongs_to :source, index: true
      t.timestamps
    end
    create_table :supporting_premises do |t|
      t.integer :parent_premise_id, index: true
      t.belongs_to :premise, index: true
      t.timestamps
    end
    add_foreign_key :supporting_premises, :premises, column: 'parent_premise_id', on_delete: :cascade
    add_foreign_key :supporting_premises, :premises, on_delete: :cascade
    add_foreign_key :premise_sources, :premises, on_delete: :cascade
    add_foreign_key :premise_sources, :sources, on_delete: :cascade
  end
end
