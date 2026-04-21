<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RecipeController extends Controller
{
    public function index(Request $request)
    {
        $query = Recipe::with(['user', 'category'])->orderBy('created_at', 'desc');
        
        if ($request->has('category_id') && $request->category_id != '') {
            $query->where('category_id', $request->category_id);
        }
        
        return response()->json($query->get());
    }

    public function myRecipes(Request $request)
    {
        $recipes = Recipe::with(['user', 'category'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($recipes);
    }

    public function show($id)
    {
        $recipe = Recipe::with(['user', 'category'])->findOrFail($id);
        return response()->json($recipe);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'ingredients' => 'required|string',
            'instructions' => 'required|string',
            'prep_time' => 'required|integer',
            'servings' => 'required|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $recipe = new Recipe($request->except('image'));
        $recipe->user_id = $request->user()->id;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('recipes', 'public');
            $recipe->image = $path;
        }

        $recipe->save();

        return response()->json($recipe, 201);
    }

    public function update(Request $request, $id)
    {
        $recipe = Recipe::findOrFail($id);
        
        // Authorization
        if ($recipe->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Niste ovlašteni'], 403);
        }

        $request->validate([
            'title' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'ingredients' => 'required|string',
            'instructions' => 'required|string',
            'prep_time' => 'required|integer',
            'servings' => 'required|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $recipe->fill($request->except('image'));

        if ($request->hasFile('image')) {
            // Brisanje stare slike ako postoji
            if ($recipe->image) {
                Storage::disk('public')->delete($recipe->image);
            }
            $path = $request->file('image')->store('recipes', 'public');
            $recipe->image = $path;
        }

        $recipe->save();

        return response()->json($recipe);
    }

    public function destroy(Request $request, $id)
    {
        $recipe = Recipe::findOrFail($id);
        
        if ($recipe->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Niste ovlašteni'], 403);
        }

        if ($recipe->image) {
            Storage::disk('public')->delete($recipe->image);
        }

        $recipe->delete();

        return response()->json(['message' => 'Recept uspješno obrisan']);
    }
}
